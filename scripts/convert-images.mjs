import sharp from 'sharp';
import { readFileSync, statSync } from 'fs';
import path from 'path';

const files = [
  'public/images/crm-macbook.png',
  'public/images/crm-ipad.png',
  'public/images/crm-iphone.png',
];

for (const f of files) {
  const out = f.replace(/\.png$/, '.webp');
  const before = statSync(f).size;
  await sharp(readFileSync(f))
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  const after = statSync(out).size;
  console.log(`${path.basename(f)}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (${((1-after/before)*100).toFixed(0)}% smaller) → ${out}`);
}
