# I Read Space — Google SEO Checklist

This is a final check of how each section and page is set up for Google ranking. Use it as a reference; no need to change anything unless you add new pages.

---

## ✅ What’s already in place

### Site-wide
- **robots.txt** — Allows crawling; points to sitemap; disallows `/login.html`, `/my-pathways.html`, `/confirm.html`, `/schedule.html`, `/reserved.html`, `/js/`.
- **sitemap.xml** — All indexable pages listed (home, about, FAQ, intake, insights index, all insight articles, healing, reset, practice/ascendant pages, all modality pages, policy pages). `lastmod` and `priority` set.
- **404 page** — Has `noindex, follow` so it doesn’t get indexed.
- **Test/utility pages** — `test-core-benefits-gap.html` and `alternative-healing-practices-backup.html` have `noindex, nofollow`. Confirm and reserved have `noindex, nofollow`; login/schedule/my-pathways/confirm/reserved are in `Disallow` in robots.txt.

### Every indexable page type
- **Unique & descriptive `<title>`** (brand “I Read Space” at end where relevant).
- **Unique `<meta name="description">`** (around 150–160 chars for snippets).
- **Canonical URL** — `<link rel="canonical" href="https://ireadspace.com/...">` so Google knows the preferred URL.
- **Open Graph** — `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (and `og:locale` on main pages).
- **Twitter Card** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- **Single `<h1>`** per page (e.g. main heading; modality/insight title).
- **Semantic structure** — Header, main content, footer; sections with headings (h2, h3) in order.

### Rich results / schema
- **Home (index.html)** — Organization + WebSite JSON-LD.
- **About** — Person schema (Saumyaa S Singh, Vedic Astrologer).
- **Insights index** — ItemList of articles.
- **FAQ** — FAQPage schema (questions/answers).
- **Insight articles** (e.g. planetary-remedies) — FAQPage where applicable.
- **404** — Correct title/description and noindex so it doesn’t rank.

### Page types covered
| Section / page type        | Title | Meta desc | Canonical | OG/Twitter | Schema / notes        |
|----------------------------|-------|-----------|-----------|------------|------------------------|
| Home                       | ✅    | ✅        | ✅        | ✅         | Organization, WebSite |
| About                      | ✅    | ✅        | ✅        | ✅         | Person                 |
| FAQ                        | ✅    | ✅        | ✅        | ✅         | FAQPage               |
| Insights index             | ✅    | ✅        | ✅        | ✅         | ItemList              |
| Insight articles           | ✅    | ✅        | ✅        | ✅         | FAQPage where used    |
| Reset (reset-now, start)   | ✅    | ✅        | ✅        | ✅         | —                     |
| Ascendant reset (12)       | ✅    | ✅        | ✅        | ✅         | —                     |
| Healing / practices        | ✅    | ✅        | ✅        | ✅         | —                     |
| Modalities (~90)           | ✅    | ✅        | ✅        | ✅         | —                     |
| Intake                     | ✅    | ✅        | ✅        | ✅         | —                     |
| Policies (privacy, refund, etc.) | ✅ | ✅   | ✅        | ✅         | —                     |
| 404                        | ✅    | ✅        | canonical | ✅         | noindex               |
| Test / backup pages        | —     | —         | —         | —         | noindex               |
| Login, schedule, reserved, confirm, my-pathways | ✅ | ✅ | ✅ (where present) | — | Disallow in robots + noindex where set |

---

## What to do when you add a new page

1. **Title** — Unique, descriptive, under ~60 chars; end with “| I Read Space” if you want.
2. **Meta description** — Unique, 150–160 chars, summarises the page.
3. **Canonical** — `<link rel="canonical" href="https://ireadspace.com/path/to/page.html" />`.
4. **Open Graph & Twitter** — Same title/description/image as above.
5. **One h1** — Main page heading; then h2, h3 in order.
6. **Sitemap** — Add the URL to `sitemap.xml` with `<lastmod>`, `<changefreq>`, `<priority>`.
7. **Robots** — If the page is private or duplicate (e.g. backup), add `<meta name="robots" content="noindex, nofollow" />` and/or add it to `Disallow` in robots.txt.

---

## Optional (already good, can refine later)

- **Modality pages** — Descriptions are generic (“Learn how X works…”). You can later tailor one sentence per modality for better long-tail search.
- **Insight articles** — Add Article schema (headline, datePublished, author) if you want rich article snippets.
- **Sitemap lastmod** — Update dates in sitemap when you change key pages (e.g. monthly) so crawlers know to re-check.

---

## Summary

- All indexable sections and pages are set up for Google: unique titles, descriptions, canonicals, social tags, and clear structure.
- 404, test, and backup pages are noindexed; utility pages are disallowed or noindexed so they don’t compete for ranking.
- Sitemap and robots.txt are correct. For new content, add the page to the sitemap and follow the “new page” checklist above.
