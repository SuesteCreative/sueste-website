import xlsx from 'xlsx';
import path from 'path';

const excelPath = path.join(process.cwd(), 'social-media', 'SocialMedia.xlsx');
const workbook = xlsx.readFile(excelPath);
const sheet = workbook.Sheets['CALENDAR'];
const rows = xlsx.utils.sheet_to_json(sheet);

console.log('--- DEBUG FILTER ---');
rows.slice(0, 15).forEach((r, i) => {
    const approval = String(r['Approval'] || '').trim();
    const status = String(r['Status'] || '').trim();
    const date = r['Publish DateTime'];
    const platform = r['Platform'];

    const isApproved = approval.toLowerCase() === 'sim' || approval.toLowerCase() === 'yes';
    const isStatusOk = status.toLowerCase() === 'approved' || status.toLowerCase() === 'active';
    const hasDate = !!date;
    const hasPlatform = !!platform;

    console.log(`Row ${i + 1}: 
      Topic: "${r['Topic/Angle']}"
      Approval: "${approval}" (Pass: ${isApproved})
      Status: "${status}" (Pass: ${isStatusOk})
      Date: "${date}" (Pass: ${hasDate})
      Platform: "${platform}" (Pass: ${hasPlatform})
      OVERALL: ${isApproved && isStatusOk && hasDate && hasPlatform}
    `);
});
