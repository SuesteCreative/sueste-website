import xlsx from 'xlsx';
const workbook = xlsx.readFile('SocialMedia.xlsx');
const sheet = workbook.Sheets['CALENDAR'];
const rows = xlsx.utils.sheet_to_json(sheet, { cellDates: true });
const approved = rows.filter(r => String(r.Approval).toLowerCase() === 'sim');
console.log('Approved posts:', approved.length);
if (approved.length > 0) {
    console.log('Sample:', approved[0]['Topic/Angle'], approved[0]['Status']);
}
