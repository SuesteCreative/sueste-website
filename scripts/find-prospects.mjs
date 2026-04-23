#!/usr/bin/env node
/**
 * Usage:
 *   GOOGLE_PLACES_API_KEY=xxx node scripts/find-prospects.mjs "hotel Portimão"
 *   GOOGLE_PLACES_API_KEY=xxx node scripts/find-prospects.mjs "restaurante Lagos" --pages 3
 *
 * Writes: marketing/prospects-<slug>-<date>.csv
 * Priority: no-website businesses first (prime cold-outreach targets).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "marketing");

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error(
    "Missing env var GOOGLE_PLACES_API_KEY. Get one at console.cloud.google.com → APIs → Credentials.",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/find-prospects.mjs "<query>" [--pages N]');
  process.exit(1);
}

const pagesFlagIdx = args.indexOf("--pages");
const maxPages =
  pagesFlagIdx >= 0 ? Math.min(3, parseInt(args[pagesFlagIdx + 1], 10) || 1) : 3;
const query = args.filter((a, i) => i !== pagesFlagIdx && i !== pagesFlagIdx + 1).join(" ");

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK = [
  "places.displayName",
  "places.formattedAddress",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.primaryTypeDisplayName",
  "places.businessStatus",
  "nextPageToken",
].join(",");

async function searchPage(pageToken) {
  const body = {
    textQuery: query,
    languageCode: "pt",
    regionCode: "PT",
    pageSize: 20,
  };
  if (pageToken) body.pageToken = pageToken;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Places API ${res.status}: ${text}`);
  }
  return res.json();
}

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

async function main() {
  const all = [];
  let pageToken = null;
  for (let i = 0; i < maxPages; i++) {
    const data = await searchPage(pageToken);
    const places = data.places || [];
    all.push(...places);
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
    await new Promise((r) => setTimeout(r, 2000));
  }

  const active = all.filter((p) => (p.businessStatus || "OPERATIONAL") === "OPERATIONAL");

  const rows = active.map((p) => ({
    name: p.displayName?.text || "",
    hasWebsite: p.websiteUri ? "NO" : "YES — PRIORITY",
    website: p.websiteUri || "",
    phone: p.nationalPhoneNumber || p.internationalPhoneNumber || "",
    rating: p.rating ?? "",
    reviews: p.userRatingCount ?? "",
    type: p.primaryTypeDisplayName?.text || "",
    address: p.formattedAddress || "",
    gmaps: p.googleMapsUri || "",
  }));

  rows.sort((a, b) => {
    const aNoSite = a.hasWebsite.startsWith("YES") ? 0 : 1;
    const bNoSite = b.hasWebsite.startsWith("YES") ? 0 : 1;
    if (aNoSite !== bNoSite) return aNoSite - bNoSite;
    return (b.rating || 0) - (a.rating || 0);
  });

  const header =
    "Name,NoWebsitePriority,Website,Phone,Rating,Reviews,Type,Address,GMapsURL,Sent,Reply,Status,Notes";
  const csv = [
    header,
    ...rows.map((r) =>
      [
        csvEscape(r.name),
        csvEscape(r.hasWebsite),
        csvEscape(r.website),
        csvEscape(r.phone),
        csvEscape(r.rating),
        csvEscape(r.reviews),
        csvEscape(r.type),
        csvEscape(r.address),
        csvEscape(r.gmaps),
        "",
        "",
        "New",
        "",
      ].join(","),
    ),
  ].join("\n");

  await fs.mkdir(OUT_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const file = path.join(OUT_DIR, `prospects-${slugify(query)}-${date}.csv`);
  await fs.writeFile(file, csv, "utf8");

  const noSite = rows.filter((r) => r.hasWebsite.startsWith("YES")).length;
  console.log(`Query:        ${query}`);
  console.log(`Total found:  ${rows.length}`);
  console.log(`No website:   ${noSite}  ← PRIME COLD-OUTREACH TARGETS`);
  console.log(`Has website:  ${rows.length - noSite}  (run PageSpeed next)`);
  console.log(`Output:       ${path.relative(ROOT, file)}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
