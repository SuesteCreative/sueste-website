const { chromium, devices } = require('playwright');

(async () => {
    const browser = await chromium.launch();

    // Function to hide sticky elements like cookie banners
    const hideSticky = async (page) => {
        await page.waitForTimeout(3000); // Wait for animations
        await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' || style.position === 'sticky') {
                    // check if it's likely a cookie banner/chat
                    el.style.display = 'none';
                }
            });
            // Specific overrides if needed
            const wpCookie = document.querySelector('#cookie-law-info-bar');
            if (wpCookie) wpCookie.style.display = 'none';
        });
    };

    console.log("Algo Atelier (iPhone)...");
    const context1 = await browser.newContext({
        ...devices['iPhone 12 Pro'],
        viewport: { width: 390, height: 844 },
    });
    const page1 = await context1.newPage();
    await page1.goto('https://algoatelier.pt/', { waitUntil: 'networkidle' });
    try { await page1.click('text=Aceitar'); } catch (e) { }
    try { await page1.click('text=Aceito'); } catch (e) { }
    try { await page1.click('text=Accept'); } catch (e) { }
    await hideSticky(page1);
    await page1.screenshot({ path: 'public/images/portfolio/algoatelier.jpg', fullPage: true, type: 'jpeg', quality: 85 });

    console.log("Mental8Works (iPad)...");
    const context2 = await browser.newContext({
        ...devices['iPad Pro 11'],
        viewport: { width: 834, height: 1194 }
    });
    const page2 = await context2.newPage();
    await page2.goto('https://www.mental8works.pt/', { waitUntil: 'networkidle' });
    try { await page2.click('text=Aceitar'); } catch (e) { }
    try { await page2.click('text=Aceito'); } catch (e) { }
    await hideSticky(page2);
    await page2.screenshot({ path: 'public/images/portfolio/mental8works.jpg', fullPage: true, type: 'jpeg', quality: 85 });

    console.log("Desportos (Macbook)...");
    const context3 = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    const page3 = await context3.newPage();
    await page3.goto('https://desportosnauticosalvor.com/', { waitUntil: 'networkidle' });
    try { await page3.click('text=Aceitar'); } catch (e) { }
    try { await page3.click('text=Accept'); } catch (e) { }
    await hideSticky(page3);
    await page3.screenshot({ path: 'public/images/portfolio/desportos.jpg', fullPage: true, type: 'jpeg', quality: 90 });

    await browser.close();
    console.log("Done!");
})();
