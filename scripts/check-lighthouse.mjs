#!/usr/bin/env node
/**
 * Runs Google PageSpeed Insights API (mobile strategy) on every URL in a prospects CSV
 * and writes a ranked CSV with Lighthouse scores (worst first = prime outreach targets).
 *
 * Usage:
 *   node scripts/check-lighthouse.mjs marketing/prospects-hotel-portimao-2026-04-20.csv
 *   PAGESPEED_API_KEY=xxx node scripts/check-lighthouse.mjs <csv>   # optional, higher rate limit
 *
 * PSI API is free — no key needed for low volume (~25k/day per IP).
 * A key makes it more reliable: console.cloud.google.com → enable "PageSpeed Insights API".
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const API_KEY = process.env.PAGESPEED_API_KEY;
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/check-lighthouse.mjs <prospects.csv>");
  process.exit(1);
}
const inputFile = path.resolve(args[0]);

const PSI = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = parseRow(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseRow(line);
    const obj = {};
    header.forEach((h, i) => (obj[h] = cells[i] ?? ""));
    return obj;
  });
}

function parseRow(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else {
        cur += c;
      }
    } else {
      if (c === ",") {
        out.push(cur);
        cur = "";
      } else if (c === '"') {
        inQ = true;
      } else {
        cur += c;
      }
    }
  }
  out.push(cur);
  return out;
}

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

async function checkOne(url) {
  const qs = new URLSearchParams({
    url,
    strategy: "mobile",
    category: "performance",
  });
  if (API_KEY) qs.set("key", API_KEY);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${PSI}?${qs}`, { signal: controller.signal });
    if (!res.ok) {
      return { error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const perf = data.lighthouseResult?.categories?.performance?.score;
    const lcp =
      data.lighthouseResult?.audits?.["largest-contentful-paint"]?.displayValue;
    const cls =
      data.lighthouseResult?.audits?.["cumulative-layout-shift"]?.displayValue;
    const tbt =
      data.lighthouseResult?.audits?.["total-blocking-time"]?.displayValue;
    return {
      score: perf !== undefined ? Math.round(perf * 100) : null,
      lcp: lcp || "",
      cls: cls || "",
      tbt: tbt || "",
    };
  } catch (e) {
    return { error: e.name === "AbortError" ? "timeout" : e.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const text = await fs.readFile(inputFile, "utf8");
  const rows = parseCsv(text);
  const withSites = rows.filter((r) => r.Website && /^https?:\/\//i.test(r.Website));
  console.log(`Checking ${withSites.length} URLs via PageSpeed Insights (mobile)...`);
  console.log(`This takes ~20s per URL. Be patient.\n`);

  const results = [];
  for (let i = 0; i < withSites.length; i++) {
    const r = withSites[i];
    process.stdout.write(`[${i + 1}/${withSites.length}] ${r.Name} ... `);
    const res = await checkOne(r.Website);
    if (res.error) {
      console.log(`ERR (${res.error})`);
      results.push({ ...r, Score: "", LCP: "", CLS: "", TBT: "", PSIError: res.error });
    } else {
      console.log(`${res.score}`);
      results.push({
        ...r,
        Score: res.score ?? "",
        LCP: res.lcp,
        CLS: res.cls,
        TBT: res.tbt,
        PSIError: "",
      });
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  results.sort((a, b) => {
    const as = a.Score === "" ? 999 : Number(a.Score);
    const bs = b.Score === "" ? 999 : Number(b.Score);
    return as - bs;
  });

  const header = [
    "Name",
    "Score",
    "LCP",
    "CLS",
    "TBT",
    "Website",
    "Phone",
    "Rating",
    "Reviews",
    "Type",
    "Address",
    "GMapsURL",
    "PSIError",
    "Status",
    "Notes",
  ];
  const csv = [
    header.join(","),
    ...results.map((r) =>
      header
        .map((h) => csvEscape(r[h] !== undefined ? r[h] : ""))
        .join(","),
    ),
  ].join("\n");

  const base = path.basename(inputFile, ".csv");
  const outFile = path.join(
    path.dirname(inputFile),
    `${base}-ranked.csv`,
  );
  await fs.writeFile(outFile, csv, "utf8");

  const bad = results.filter((r) => r.Score !== "" && Number(r.Score) < 50).length;
  const mid = results.filter(
    (r) => r.Score !== "" && Number(r.Score) >= 50 && Number(r.Score) < 80,
  ).length;
  console.log(`\nDone.`);
  console.log(`Output: ${path.relative(ROOT, outFile)}`);
  console.log(`  <50 (prime targets): ${bad}`);
  console.log(`  50–79 (worth a look): ${mid}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
