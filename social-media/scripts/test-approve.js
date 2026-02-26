import xlsx from 'xlsx';
const FILE = process.env.EXCEL_PATH || 'SocialMedia.xlsx';
const workbook = xlsx.readFile(FILE);
const sheet = workbook.Sheets['CALENDAR'];
const rows = xlsx.utils.sheet_to_json(sheet, { cellDates: true });

if (rows.length >= 2) {
    // Post 1: Wednesday (Video)
    rows[0]['Approval'] = 'Sim';
    rows[0]['Status'] = 'Approved';
    rows[0]['Asset Type'] = 'Video/Reel';
    rows[0]['Angle Type'] = 'Educativo';
    rows[0]['Hook'] = '3 Dicas Digitais';
    rows[0]['Caption PT'] = 'Legenda em Português para vídeo.';
    rows[0]['Caption EN'] = 'English caption for video.';

    // Post 2: Saturday (Carousel - Estás a perder clientes)
    rows[1]['Approval'] = 'Sim';
    rows[1]['Status'] = 'Approved';
    rows[1]['Asset Type'] = 'Design';
    rows[1]['Angle Type'] = 'Autoridade';
    rows[1]['Hook'] = 'Estás a perder clientes se o teu site tem isto';
    rows[1]['Problem Being Addressed'] = 'O teu site pode estar a afastar leads sem tu saberes.';

    rows[1]['Slide 2 Hook'] = '1. Carregamento Lento';
    rows[1]['Slide 2 Subtitle'] = 'Mais de 3 segundos e o utilizador desiste.';

    rows[1]['Slide 3 Hook'] = '2. Navegação Confusa';
    rows[1]['Slide 3 Subtitle'] = 'Se eles não encontram o que procuram, vão-se embora.';

    rows[1]['Slide 4 Hook'] = '3. Falta de CTAs Claros';
    rows[1]['Slide 4 Subtitle'] = 'O que é que queres que eles façam? Diz-lhes.';

    rows[1]['Slide 5 Hook'] = 'Queres resolver isto?';
    rows[1]['Slide 5 Subtitle'] = 'Envia-nos uma mensagem e analisamos o teu site.';

    rows[1]['Caption PT'] = 'O teu site é a tua montra digital. Se não estiver otimizado, estás a deixar dinheiro na mesa.';
    rows[1]['Caption EN'] = 'Your website is your digital storefront. If it is not optimized, you are leaving money on the table.';

    const newSheet = xlsx.utils.json_to_sheet(rows);
    workbook.Sheets['CALENDAR'] = newSheet;
    xlsx.writeFile(workbook, FILE);
    console.log(`Excel ${FILE} atualizado para testes de Captions unificadas e Carrossel de Sábado.`);
}
