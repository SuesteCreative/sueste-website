# Prospecting Workflow — Sueste Creative

End-to-end weekly routine for finding 30 cold-outreach prospects in ~30 minutes.

---

## One-time setup (15 min)

### 1. Create Google Cloud project
1. Go to https://console.cloud.google.com
2. Top bar → project dropdown → **New Project**
3. Name: `sueste-prospects`. Create.

### 2. Enable the two APIs
Within the project:
1. Menu → **APIs & Services → Library**
2. Search **"Places API (New)"** → click → **Enable**
3. Search **"PageSpeed Insights API"** → click → **Enable**

### 3. Create API key
1. **APIs & Services → Credentials**
2. **+ Create Credentials → API key**
3. Copy the key shown (you'll paste it below)
4. Click **Restrict Key**:
   - **Application restrictions:** *None* (keep simple for now)
   - **API restrictions:** Select "Places API (New)" + "PageSpeed Insights API"
5. Save

### 4. Put key in your shell
Once, in a terminal (bash):
```bash
echo 'export GOOGLE_PLACES_API_KEY="PASTE_KEY_HERE"' >> ~/.bashrc
echo 'export PAGESPEED_API_KEY="PASTE_KEY_HERE"' >> ~/.bashrc
source ~/.bashrc
```
(Same key works for both — you enabled both APIs on it.)

### 5. Free tier
- Places API (New): $200/mo free credit → hundreds of searches.
- PageSpeed: 25k/day free, no cost.
- Stay well under even with 30 prospects/week.

---

## Weekly workflow (~30 min)

### Step 1 — Find prospects (2 min)
```bash
npm run prospects -- "hotel Portimão"
npm run prospects -- "restaurante Lagos"
npm run prospects -- "imobiliária Albufeira"
```
Each command:
- Returns up to 60 active businesses
- **Sorts "no website" first** — those are instant cold-outreach gold
- Writes `marketing/prospects-<query>-<date>.csv`

Queries that work well (rotate weekly):
- `hotel <cidade>` · `guesthouse <cidade>` · `boutique hotel <região>`
- `restaurante <cidade>` · `marisqueira <cidade>` · `tasca <cidade>`
- `imobiliária <cidade>` · `real estate <cidade>`
- `arquitecto <cidade>` · `atelier arquitetura <cidade>`
- `clínica <cidade>` · `ginásio <cidade>` · `loja <cidade>`

Cycle cities: Portimão, Lagos, Albufeira, Faro, Loulé, Lagoa, Silves, Olhão.

### Step 2 — Rank by site quality (10 min)
For prospects WITH a website, check Lighthouse mobile:
```bash
npm run lighthouse -- marketing/prospects-hotel-portimao-2026-04-20.csv
```
Writes `…-ranked.csv` sorted **worst Lighthouse first**. These are prime Loom-outreach targets — you already have the angle ("your site scores X").

Takes ~20s per URL. 30 URLs = ~10 min — leave it running.

### Step 3 — Build the week's target list (10 min)
Open both CSVs in Google Sheets. Pick your weekly 30 using this mix:
- **10 businesses with NO website** (highest convert rate, easiest pitch)
- **15 businesses with Lighthouse score <50** (clearest pain point)
- **5 businesses with score 50–80** (softer pitch, more polish)

Copy into the master outreach tracker.

### Step 4 — Outreach (3h/week, 6/day)
Follow the Loom scripts in [`outreach-templates.md`](./outreach-templates.md).

---

## Column reference

### `prospects-*.csv`
| Column | Meaning |
|---|---|
| `NoWebsitePriority` | "YES — PRIORITY" = no website. "NO" = has one. |
| `Website` | URL if any |
| `Phone` | From GBP |
| `Rating`, `Reviews` | GBP score |
| `Type` | Primary business type per Google |
| `GMapsURL` | Direct GMaps link (open to verify business is real) |
| `Sent`, `Reply`, `Status`, `Notes` | Empty — fill as you work the list |

### `*-ranked.csv` (after Lighthouse)
Adds: `Score` (0–100 mobile perf), `LCP`, `CLS`, `TBT`, `PSIError`.
Sorted worst → best.

---

## Troubleshooting

**`Places API 403`** — API not enabled on the project, or key restrictions too tight. Go back to setup step 2 or 3.

**`Places API 400 INVALID_ARGUMENT`** — query too short or empty. Use 2+ words.

**PSI `HTTP 500` on some URLs** — the target site is genuinely broken (JS error, server down). That's useful intel — flag it in your pitch.

**All results from same city chain** — Places ranks by relevance. Narrow by putting city first: `"Portimão hotel"` vs `"hotel Portimão"`.
