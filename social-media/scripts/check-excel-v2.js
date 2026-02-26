import xlsx from 'xlsx';
import path from 'path';

const excelPath = path.join(process.cwd(), 'social-media', 'SocialMedia.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['CALENDAR'];
const rows = xlsx.utils.sheet_to_json(sheet);

rows.slice(0, 10).forEach((r, i) => {
    console.log(`Row ${i + 1}: Approval=[${r.Approval}] Status=[${r.Status}] Date=[${r['Publish DateTime']}] Platform=[${r.Platform}] Topic=[${r['Topic/Angle']}]`);
});
