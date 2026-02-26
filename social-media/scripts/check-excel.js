import xlsx from 'xlsx';
import path from 'path';

const excelPath = path.join(process.cwd(), 'social-media', 'SocialMedia.xlsx');
console.log('Reading:', excelPath);

const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['CALENDAR'];
const rows = xlsx.utils.sheet_to_json(sheet);

console.log('Total rows in CALENDAR:', rows.length);
if (rows.length > 0) {
    console.log('Columns found:', Object.keys(rows[0]));

    // Check specific row for debug
    rows.slice(0, 5).forEach((r, i) => {
        console.log(`Row ${i + 1}: Approval='${r.Approval}', Status='${r.Status}', Date='${r['Publish DateTime']}', Platform='${r.Platform}'`);
    });
}
