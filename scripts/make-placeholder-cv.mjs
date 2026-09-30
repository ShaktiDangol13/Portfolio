import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * Generates a valid placeholder PDF so the DOWNLOAD CV action never 404s.
 * Replace public/Shakti-Dangol-CV.pdf with the real CV and delete this script.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(__dirname, '../public/Shakti-Dangol-CV.pdf');

if (fs.existsSync(outFile) && !process.argv.includes('--force')) {
  console.log('CV already present, placeholder skipped');
  process.exit(0);
}

const content = [
  'BT',
  '/F1 22 Tf',
  '60 760 Td',
  '(PLACEHOLDER CV) Tj',
  '/F1 12 Tf',
  '0 -40 Td',
  '(This file is a placeholder.) Tj',
  '0 -24 Td',
  '(Replace public/Shakti-Dangol-CV.pdf with the real CV of Shakti Dangol.) Tj',
  '0 -36 Td',
  '(Shakti Dangol - Junior Software QA Engineer) Tj',
  '0 -20 Td',
  '(Manual Testing / API Testing / Database Testing) Tj',
  'ET',
].join('\n');

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
];

let pdf = '%PDF-1.4\n';
const offsets = [];

objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';
offsets.forEach((offset) => {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
});
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

fs.writeFileSync(outFile, Buffer.from(pdf, 'latin1'));
console.log(`wrote ${outFile}`);
