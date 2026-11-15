# AI-Powered SEO Blog Generator

Upload a CSV of companies, give it a topic, and get a server-rendered, SEO-optimised blog page with a ranking table, statistics and AI-written copy. Nothing is hardcoded for one industry, so the same app handles fintech, healthtech, cleantech and so on.

## Live demo

- App: https://beauhurst-seo-blog.hassan-oh-osman.workers.dev/
- Example (fintech): https://beauhurst-seo-blog.hassan-oh-osman.workers.dev/blog/uk-fintech-companies

To try it: open the app, enter a topic, choose a CSV file and click **Generate blog**. You are redirected to the new page.


## How it works

The system keeps three layers apart:

1. **Data layer (code, no AI).** The CSV is parsed, columns are classified as numbers or text, and the label column (the name of each row) and the metric column (the number to rank by) are detected from the data. Statistics are computed in code: ranking, total, average, median, top-10 share and per-category counts.
2. **Content layer (AI).** A compact summary of those statistics, not the raw rows, is sent to Gemini, which returns JSON with the title, meta description, introduction, insight sections and conclusion. The AI only writes prose around figures that code has already computed.
3. **Presentation layer.** One Vue page template renders the saved statistics and copy. It is server-rendered, so the title, meta tags, headings and the full table are in the HTML that search engines receive.

Generated blogs are saved by slug (for example `uk-fintech-companies`) and loaded from storage when the page is requested.

### Request flow

`Upload form` → `POST /api/generate` → parse CSV → compute stats → build summary → Gemini → save blog → redirect to `/blog/<slug>`


## Tools

- **Nuxt 4** (Vue 3, Nitro server) for the pages and API routes
- **Google Gemini API** (`gemini-3.5-flash-lite`, free tier) via the `@google/genai` SDK
- **d3-dsv** for CSV parsing
- **Cloudflare Workers** for hosting and **Workers KV** for storing generated blogs
- **GitHub** for source control, connected to Cloudflare for automatic deploys

## Project structure

```
app/pages/index.vue          upload form
app/pages/blog/[slug].vue    blog page template
app/assets/css/main.css      styles
server/api/generate.post.ts  CSV in, saved blog out
server/api/blog/[slug].get.ts  loads a saved blog
server/utils/parseDataset.ts   reads the CSV, detects column types, label and metric columns
server/utils/computeStats.ts   ranking, totals, median, top-10 share, category breakdowns
server/utils/buildSummary.ts   compact summary of the stats sent to the AI
server/utils/buildPrompt.ts    system instruction and the BlogCopy type
server/utils/generateCopy.ts   calls Gemini and parses the JSON reply
server/utils/withRetry.ts      retries temporary Gemini failures with backoff
server/utils/blogStore.ts      save, load and unique-slug helpers
data/                        seed fintech CSV
```


## Run it locally

Requirements: Node 24.15+ (or 22.22+) and a free Gemini API key from https://aistudio.google.com/apikey.

```bash
git clone https://github.com/HassanOHOsman/beauhurst-seo-blog.git
cd beauhurst-seo-blog
npm install
cp .env.example .env     # then paste your Gemini key into .env
npm run dev
```

Open http://localhost:3000, upload `data/fintech_companies_seed.csv` with the topic "UK fintech companies", and you are redirected to the generated blog. Locally, generated blogs are stored as files in `.data/blogs` (git-ignored).

To check the production build: `npm run build`.


## Configuration

| Name | Where | Purpose |
|------|-------|---------|
| `NUXT_GEMINI_API_KEY` | `.env` locally; a **runtime secret** on the Cloudflare Worker | Gemini API key. Nuxt maps it to `runtimeConfig.geminiApiKey` and it is only readable on the server. |
| `BLOGS` KV binding | `nuxt.config.ts` (`nitro.cloudflare.wrangler.kv_namespaces`) | Production storage for generated blogs. In development the same `blogs` store points at `.data/blogs`. |

## Deployment (Cloudflare Workers)

The repo is connected to a Cloudflare Worker, so every push to `main` builds and deploys automatically.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build variable: `NODE_VERSION=24`
- Runtime secret: `NUXT_GEMINI_API_KEY`
- KV namespace: `BLOGS`, bound in `nuxt.config.ts`



## Limitations

- Label and metric columns are detected with heuristics (uniqueness, header names), so unusual CSVs may pick the wrong column.
- The "top 10 share" uses a fixed cut-off, which is not meaningful on very small datasets.
- Category totals can overlap when a row has several values (for example sectors), so they may add up to more than the overall total.
- The AI writes the prose, and it can occasionally misquote a figure. Numbers are computed in code, but the generated text is not automatically validated against them.
- The generate endpoint has no authentication or rate limiting, so anyone with the URL can use the Gemini quota.
- Free tiers apply: Gemini rate limits, Cloudflare Workers' 10 ms CPU time per request, and KV's eventual consistency (a new blog can take a moment to appear everywhere).