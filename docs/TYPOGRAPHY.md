# Typography scale — single source of truth

Use these variables everywhere. Avoid hardcoded `font-size` values (e.g. `17px`, `15px`, `28px`) so the site stays consistent.

## Defined in `styles.css` (:root)

| Role        | Variable           | Size  | Use for |
|------------|--------------------|-------|---------|
| Display    | `--text-display`   | 72px  | Rare hero / marketing display |
| H1 (hero)  | `--text-h1-hero`   | 55px  | Homepage hero heading only |
| H1 (page)  | `--text-h1-page`   | 42px  | All other page titles (H1) |
| H2         | `--text-h2`        | 34px  | Section headings |
| H3         | `--text-h3`        | 24px  | Subsection headings |
| H4         | `--text-h4`        | 20px  | Card titles, smaller headings |
| H5         | `--text-h5`        | 18px  | Small headings, lead/intro paragraphs |
| **Body**   | `--text-body`      | **16px** | Main reading text, paragraphs, accordion answers |
| **Subtext / small** | `--text-small` | **14px** | Supporting text, captions under headings, nav |
| Caption    | `--text-caption`   | 12px  | Labels, fine print, timestamps |

## Semantic mapping (for consistency)

- **H1** → `var(--text-h1-hero)` on homepage hero; `var(--text-h1-page)` everywhere else.
- **H2** → `var(--text-h2)` (34px).
- **H3** → `var(--text-h3)` (24px).
- **H4** → `var(--text-h4)` (20px).
- **Body text** (paragraphs, accordion content, main copy) → `var(--text-body)` (16px).
- **Subtext** (under headings, secondary lines, smaller UI) → `var(--text-small)` (14px).
- **Caption / label** → `var(--text-caption)` (12px).

## Current inconsistency

Many places use hardcoded sizes instead of these variables, e.g.:

- **13px** — used in FAQ answers, some modals; consider `--text-small` (14px) or keep 13px only for dense UI if intentional.
- **15px** — used in accordions, some sections; should be `--text-body` (16px) for body, or `--text-small` (14px) for subtext.
- **17px, 18px** — used for “lead” or emphasis; align to `--text-h5` (18px) or `--text-body` (16px).
- **20px** — often aligns with `--text-h4`; use `var(--text-h4)`.
- **28px, 32px, 36px** — used for headings; map to `--text-h2` (34px), `--text-h3` (24px), or `--text-h1-page` (42px) as appropriate.

## Recommendation

1. **Body** = 16px (`--text-body`) for all paragraph and accordion answer text.
2. **Subtext** = 14px (`--text-small`) for anything secondary under a heading or in UI.
3. Replace hardcoded sizes with the variables above so one change in `:root` updates the whole site.
