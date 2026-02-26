import path from 'path';
import fs from 'fs-extra';
import xlsx from 'xlsx';
import { chromium } from 'playwright';
import { DateTime } from 'luxon';
import { createObjectCsvWriter } from 'csv-writer';

const ICONS = {
    'WebDev': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    'Dica Digital': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.9 1.2 1.7 1.5 2.9"></path><line x1="9" y1="18" x2="15" y2="18"></line><line x1="10" y1="22" x2="14" y2="22"></line></svg>',
    'Resultados': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>'
};

// Paths
const BASE_DIR = process.cwd();
const EXCEL_PATH = process.env.EXCEL_PATH || path.join(BASE_DIR, 'social-media', 'SocialMedia.xlsx');
const OUTBOX_DIR = path.join(BASE_DIR, 'social-media', 'outbox');
const TEMPLATES_DIR = path.join(BASE_DIR, 'social-media', 'templates');
const LOGS_DIR = path.join(OUTBOX_DIR, 'logs');

// Ensure directories exist
fs.ensureDirSync(OUTBOX_DIR);
fs.ensureDirSync(LOGS_DIR);

const logFile = path.join(LOGS_DIR, `${DateTime.now().toFormat('yyyy-MM-dd')}_run.txt`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
    const timestamp = DateTime.now().toFormat('HH:mm:ss');
    const formattedMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    logStream.write(formattedMessage);
}

async function run() {
    log('--- Iniciando automação social ---');

    if (!fs.existsSync(EXCEL_PATH)) {
        log(`Erro: Ficheiro Excel não encontrado em ${EXCEL_PATH}`);
        return;
    }

    // Read Excel
    const workbook = xlsx.readFile(EXCEL_PATH);
    const sheetName = 'CALENDAR';
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        log(`Erro: Sheet ${sheetName} não encontrada no Excel.`);
        return;
    }

    const rows = xlsx.utils.sheet_to_json(sheet, { cellDates: true });
    log(`Lidas ${rows.length} linhas da sheet CALENDAR.`);

    // Filter approved posts
    const approvedPosts = rows.filter(row => {
        const approvalVal = String(row['Approval'] || '').toLowerCase();
        const statusVal = String(row['Status'] || '').toLowerCase();

        const isApproved = approvalVal === 'sim' || approvalVal === 'yes';
        const isStatusOk = statusVal === 'approved' || statusVal === 'active' || statusVal === 'draft';

        const hasDate = !!row['Publish DateTime'];
        const hasPlatform = !!row['Platform'];
        return isApproved && isStatusOk && hasDate && hasPlatform;
    });

    log(`Encontrados ${approvedPosts.length} posts aprovados para exportar.`);

    if (approvedPosts.length === 0) {
        log('Nenhum post para processar. Fim.');
        return;
    }

    // Initialize Playwright
    log('Iniciando browser para renderização...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let exportCount = 0;
    const manifestData = [];

    // Group by Week
    const postsByWeek = {};
    for (const post of approvedPosts) {
        let publishDate;
        const rawDate = post['Publish DateTime'];

        if (rawDate instanceof Date) {
            publishDate = DateTime.fromJSDate(rawDate);
        } else if (typeof rawDate === 'number') {
            // Excel serial date: 25569 is 1970-01-01
            const date = new Date((rawDate - 25569) * 86400 * 1000);
            publishDate = DateTime.fromJSDate(date);
        } else {
            publishDate = DateTime.fromISO(String(rawDate));
            if (!publishDate.isValid) {
                publishDate = DateTime.fromFormat(String(rawDate), 'yyyy-MM-dd HH:mm');
            }
        }

        if (!publishDate.isValid) {
            log(`Aviso: Data inválida para o post: ${post['Topic/Angle']}. Pulando.`);
            continue;
        }

        // ISO Week format: 2026-W08
        const weekStr = publishDate.toFormat('kkkk-\'W\'WW');
        if (!postsByWeek[weekStr]) postsByWeek[weekStr] = [];
        postsByWeek[weekStr].push({ ...post, parsedDate: publishDate });
    }

    for (const weekStr of Object.keys(postsByWeek)) {
        const weekDir = path.join(OUTBOX_DIR, weekStr);
        fs.ensureDirSync(weekDir);
        log(`Processando semana: ${weekStr}`);

        const weekPosts = postsByWeek[weekStr];
        // Sort by date
        weekPosts.sort((a, b) => a.parsedDate.toMillis() - b.parsedDate.toMillis());

        for (let i = 0; i < weekPosts.length; i++) {
            const post = weekPosts[i];
            const platform = String(post['Platform']).toLowerCase();
            const dayName = post.parsedDate.toFormat('ccc').toLowerCase(); // mon, tue, etc.
            const prefix = String(i + 1).padStart(2, '0');
            const folderName = `${prefix}_${dayName}_${platform}`;
            const postDir = path.join(weekDir, folderName);
            fs.ensureDirSync(postDir);

            log(`Exportando: ${folderName}`);

            // Text exports
            const combinedCaptions = `--- CAPTION PT ---\n${post['Caption PT'] || ''}\n\n--- CAPTION EN ---\n${post['Caption EN'] || ''}`;
            fs.writeFileSync(path.join(postDir, 'captions.txt'), combinedCaptions);
            fs.writeFileSync(path.join(postDir, 'final_url.txt'), post['Final URL with UTM'] || '');

            const meta = [
                `Platform: ${post['Platform']}`,
                `Date: ${post.parsedDate.toFormat('yyyy-MM-dd')}`,
                `Publish DateTime: ${post.parsedDate.toFormat('yyyy-MM-dd HH:mm')}`,
                `Objective: ${post['Objective'] || ''}`,
                `KPI Principal: ${post['KPI Principal'] || ''}`,
                `Angle Type: ${post['Angle Type'] || ''}`,
                `Content Pillar: ${post['Content Pillar'] || ''}`,
                `CTA: ${post['CTA'] || ''}`,
                `UTM Campaign: ${post['UTM Campaign'] || ''}`
            ].join('\n');
            fs.writeFileSync(path.join(postDir, 'meta.txt'), meta);
            fs.writeJsonSync(path.join(postDir, 'post.json'), post, { spaces: 2 });

            // Image generation
            const assetType = String(post['Asset Type'] || '').toLowerCase();
            const isVideoFormat = assetType.includes('video') || assetType.includes('reel');
            const angleType = String(post['Angle Type'] || '').toLowerCase();

            // Carousel support: Look for Slide 1 to Slide 10
            const slides = [];
            for (let s = 1; s <= 10; s++) {
                const hookKey = s === 1 ? 'Hook' : `Slide ${s} Hook`;
                const subKey = s === 1 ? 'Problem Being Addressed' : `Slide ${s} Subtitle`;
                if (post[hookKey]) {
                    slides.push({ hook: post[hookKey], subtitle: post[subKey] || '' });
                }
            }
            // Fallback if no specific slides but main hook exists
            if (slides.length === 0 && post['Hook']) {
                slides.push({ hook: post['Hook'] || '', subtitle: post['Problem Being Addressed'] || post['CTA'] || '' });
            }

            let templateName = 'template_autoridade.html'; // Fallback
            if (angleType.includes('educativo')) templateName = 'template_educativo.html';
            else if (angleType.includes('autoridade')) templateName = 'template_autoridade.html';
            else if (angleType.includes('prova social')) templateName = 'template_prova_social.html';

            const templatePath = path.join(TEMPLATES_DIR, templateName);
            if (fs.existsSync(templatePath)) {
                const backgroundsDir = path.join(TEMPLATES_DIR, 'assets', 'backgrounds');
                const bgs = fs.existsSync(backgroundsDir) ? fs.readdirSync(backgroundsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg')) : [];

                for (let s = 0; s < slides.length; s++) {
                    const slide = slides[s];

                    // Use page.goto to ensure CSS and relative assets (logo) are loaded correctly
                    const fileUrl = `file://${templatePath.replace(/\\/g, '/')}`;
                    await page.goto(fileUrl);

                    // Inject data into the page
                    await page.evaluate((data) => {
                        const hookEl = document.querySelector('.hook');
                        const subEl = document.querySelector('.subtitle');
                        if (hookEl) hookEl.innerText = data.hook;
                        if (subEl) subEl.innerText = data.subtitle;

                        // Carousel indicator logic
                        const arrow = document.querySelector('.carousel-indicator');
                        if (arrow) {
                            if (data.isCarousel && !data.isLastSlide) {
                                arrow.classList.add('visible');
                            } else {
                                arrow.classList.remove('visible');
                            }
                        }

                        // Set Tag Icon & Text
                        const tagIconEl = document.querySelector('.tag-icon');
                        const tagTextEl = document.querySelector('.tag-text');
                        if (tagIconEl && data.iconSvg) tagIconEl.innerHTML = data.iconSvg;
                        if (tagTextEl && data.tagText) tagTextEl.innerText = data.tagText;
                    }, {
                        hook: slide.hook,
                        subtitle: slide.subtitle,
                        isCarousel: slides.length > 1,
                        isLastSlide: s === (slides.length - 1),
                        tagText: templateName.includes('autoridade') ? 'WebDev' : (templateName.includes('educativo') ? 'Dica Digital' : 'Resultados'),
                        iconSvg: templateName.includes('autoridade') ? ICONS['WebDev'] : (templateName.includes('educativo') ? ICONS['Dica Digital'] : ICONS['Resultados']),
                        icons: ICONS
                    });

                    // Background Logic
                    if (bgs.length > 0) {
                        const bgFile = bgs[(i + s) % bgs.length];
                        const bgPath = path.join(backgroundsDir, bgFile).replace(/\\/g, '/');
                        await page.evaluate((url) => {
                            document.body.style.backgroundImage = `url('file://${url}')`;
                            document.body.style.backgroundSize = 'cover';
                            document.body.style.backgroundPosition = 'center';
                        }, bgPath);
                    }

                    if (isVideoFormat) {
                        await page.evaluate(() => {
                            document.body.classList.add('video-format');
                        });
                    }

                    // Wait for any fonts or images
                    await page.waitForLoadState('networkidle');

                    // Export Dimensions: Always 4:5 or 9:16
                    const mainWidth = 1080;
                    const mainHeight = isVideoFormat ? 1920 : 1350;
                    const slidePrefix = slides.length > 1 ? `slide_${s + 1}_` : '';
                    const mainFilename = isVideoFormat ? `${slidePrefix}video_static_1080x1920.jpg` : `${slidePrefix}image_1080x1350.jpg`;

                    await page.setViewportSize({ width: mainWidth, height: mainHeight });
                    await page.screenshot({ path: path.join(postDir, mainFilename), type: 'jpeg', quality: 90 });
                }
            } else {
                log(`Aviso: Template ${templateName} não encontrado.`);
            }

            // Manifest entry
            manifestData.push({
                week: weekStr,
                folder_name: folderName,
                platform: post['Platform'],
                publish_datetime: post.parsedDate.toFormat('yyyy-MM-dd HH:mm'),
                objective: post['Objective'] || '',
                kpi: post['KPI Principal'] || '',
                angle_type: post['Angle Type'] || '',
                final_url: post['Final URL with UTM'] || ''
            });

            exportCount++;

            // Optional: Update Excel Status (Requires writing back to Excel)
            // post['Status'] = 'ReadyToPublish';
        }

        // Generate Manifest for the week
        const weekManifestCsv = path.join(weekDir, 'manifest.csv');
        const csvWriter = createObjectCsvWriter({
            path: weekManifestCsv,
            header: [
                { id: 'folder_name', title: 'folder_name' },
                { id: 'platform', title: 'platform' },
                { id: 'publish_datetime', title: 'publish_datetime' },
                { id: 'objective', title: 'objective' },
                { id: 'kpi', title: 'kpi' },
                { id: 'angle_type', title: 'angle_type' },
                { id: 'final_url', title: 'final_url' }
            ]
        });

        const weekData = manifestData.filter(m => m.week === weekStr);
        await csvWriter.writeRecords(weekData);
        fs.writeJsonSync(path.join(weekDir, 'manifest.json'), weekData, { spaces: 2 });
    }

    // Attempt to update Excel if requested
    // This part is tricky because it rewrites the whole file. 
    // We'll keep it simple: just log what was done.
    log('Processamento concluído.');
    log(`Total de posts exportados: ${exportCount}`);

    await browser.close();
    logStream.end();
}

run().catch(err => {
    log(`Erro Fatal: ${err.message}`);
    console.error(err);
    process.exit(1);
});
