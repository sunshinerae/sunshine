const fs = require('fs');

function esc(text) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildPdf(lines, outPath) {
  const objects = [];
  const add = (s) => objects.push(s);

  add('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  add('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  add('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n');

  const content = [];
  content.push('BT');
  content.push('/F1 11 Tf');
  content.push('14 TL');
  let y = 760;
  for (const line of lines) {
    content.push(`1 0 0 1 40 ${y} Tm (${esc(line)}) Tj`);
    y -= 14;
    if (y < 40) break;
  }
  content.push('ET');

  const stream = content.join('\n');
  add(`4 0 obj\n<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream\nendobj\n`);
  add('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  fs.writeFileSync(outPath, pdf);
}

const signupLines = [
  'THE SUNSHINE EFFECT - EVENT CHECK-IN SHEET',
  '',
  'Event: ____________________________   Date: __________________   Host: __________________',
  '',
  'Please print clearly. Fields: First Name | Last Name | Email | Phone | Join Email List (Y/N) | Check-In Time',
  '',
  '1.  __________________________________________________________________________________________',
  '2.  __________________________________________________________________________________________',
  '3.  __________________________________________________________________________________________',
  '4.  __________________________________________________________________________________________',
  '5.  __________________________________________________________________________________________',
  '6.  __________________________________________________________________________________________',
  '7.  __________________________________________________________________________________________',
  '8.  __________________________________________________________________________________________',
  '9.  __________________________________________________________________________________________',
  '10. __________________________________________________________________________________________',
  '11. __________________________________________________________________________________________',
  '12. __________________________________________________________________________________________',
  '13. __________________________________________________________________________________________',
  '14. __________________________________________________________________________________________',
  '15. __________________________________________________________________________________________',
  '16. __________________________________________________________________________________________',
  '17. __________________________________________________________________________________________',
  '18. __________________________________________________________________________________________',
  '',
  'Instagram: @raeofsunshineirl',
];

const paymentLines = [
  'THE SUNSHINE EFFECT - EVENT PAYMENT SHEET',
  '',
  'Thank you for being here. Contributions support facilitators and future gatherings.',
  '',
  'Suggested tiers: $25  |  $35  |  $45  |  $65  |  $100',
  '',
  'VENMO',
  'Handle: @SunshineB',
  'Link: https://venmo.com/u/SunshineB',
  'QR: [Place Venmo QR code here]',
  '',
  'ZELLE',
  'Number: (909) 519-9378',
  'Link: tel:+19095199378',
  'QR: [Place Zelle QR code here]',
  '',
  'Instagram: @raeofsunshineirl',
];

buildPdf(signupLines, 'docs/printables/sunshine-event-signup-sheet.pdf');
buildPdf(paymentLines, 'docs/printables/sunshine-payments-sheet.pdf');
console.log('PDFs generated in docs/printables');
