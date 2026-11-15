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
server/utils/                parser, stats, prompt, Gemini client, storage
data/                        seed fintech CSV
```