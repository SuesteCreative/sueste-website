#!/usr/bin/env node
// Reports how many future-dated blog posts remain per language.
// Warns when queue depth drops below the minimum threshold.

import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, "..", "src", "content", "blog");
const MIN_QUEUE_PER_LANG = 3;

function parseFrontmatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawVal] = kv;
    const val = rawVal.trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return data;
}

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md"));
const today = new Date();
today.setHours(0, 0, 0, 0);

const queue = { pt: [], en: [] };
const live = { pt: 0, en: 0 };

for (const file of files) {
  const src = await readFile(join(BLOG_DIR, file), "utf8");
  const fm = parseFrontmatter(src);
  if (!fm || !fm.pubDate || !fm.lang) continue;
  const pub = new Date(fm.pubDate);
  pub.setHours(0, 0, 0, 0);
  const lang = fm.lang in queue ? fm.lang : "pt";
  if (pub > today) {
    queue[lang].push({ file, pubDate: fm.pubDate, title: fm.title });
  } else {
    live[lang]++;
  }
}

for (const lang of ["pt", "en"]) {
  queue[lang].sort((a, b) => a.pubDate.localeCompare(b.pubDate));
}

const todayStr = today.toISOString().slice(0, 10);
console.log(`Blog queue status (today: ${todayStr})`);
console.log("==========================================");

for (const lang of ["pt", "en"]) {
  const label = lang.toUpperCase();
  console.log(`\n${label}:  ${live[lang]} live, ${queue[lang].length} scheduled`);
  for (const post of queue[lang]) {
    console.log(`  → ${post.pubDate}  ${post.title}`);
  }
}

console.log("");
let warn = false;
for (const lang of ["pt", "en"]) {
  if (queue[lang].length < MIN_QUEUE_PER_LANG) {
    console.warn(
      `WARNING: ${lang.toUpperCase()} queue has only ${queue[lang].length} future posts (minimum recommended: ${MIN_QUEUE_PER_LANG}). Time to draft more.`
    );
    warn = true;
  }
}

if (!warn) {
  console.log("OK: queue depth healthy.");
}

process.exit(warn ? 1 : 0);
