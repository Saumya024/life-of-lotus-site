# Ascendant Page & Asc Ritual — Structure (Plug-and-Play)

This document defines the **exact structure** of each Ascendant (Asc) skim-mode page and its 7-step ritual so you can duplicate the pattern for all 12 signs by swapping in sign-specific content and the ruling planet’s primary colour.

---

## 1. File & URL Structure

| Item | Pattern | Example |
|------|--------|--------|
| **Asc page file** | `practice/ascendant-reset/{sign}.html` | `practice/ascendant-reset/aries.html` |
| **URL path** | `/practice/ascendant-reset/{sign}` | `/practice/ascendant-reset/aries` |
| **Canonical** | `https://ireadspace.com/practice/ascendant-reset/{sign}` | `https://ireadspace.com/practice/ascendant-reset/aries` |
| **Asset paths from page** | `../../` for root (styles, images, js, index, reset-now) | `../../styles.css`, `../../reset-now.html` |
| **Landing link** | From `reset-now.html`, sign circle → `practice/ascendant-reset/{sign}.html` | Aries circle → `practice/ascendant-reset/aries.html` |

**Landing page:** `reset-now.html` — H1 “43-Day Ascendant / Moon Sign Reset”, subtext, grid of 12 sign circles. Each circle links to either a sign-specific page (e.g. Aries → `practice/ascendant-reset/aries.html`) or the generic wizard `reset-now-start.html?sign={sign}` until that sign’s page exists.

---

## 2. Asc Page — Overall Layout (Order of Sections)

1. **Header** (site nav; Practice → `../../reset-now.html`)
2. **Main**
   - **Hero** (above the fold)
   - **Wizard** (expandable; hidden until CTA click) — contains all 7 steps + final contract
   - **Accordions** (4 sign-specific sections; below the wizard)

So: **Hero → Wizard (expandable) → Accordions**. No content between hero and wizard except the wizard wrapper.

---

## 3. Hero (Above the Fold)

- **Container:** e.g. `.{sign}-page`, `.{sign}-container` (Aries uses `aries-page`, `aries-container`).
- **H1:**  
  `{Sign} Ascendant: 43-Day Reset`  
  (No “Fire” or other element word — e.g. “Aries Ascendant: 43-Day Reset”.)
- **Hook:**  
  Two lines, line-break between. Short, punchy.  
  Example: `You don't lack drive.<br>You lack containment.`
- **CTA wrap:** Centred.
- **CTA button:**
  - **Label:** `Start 3-Minute Reset`
  - **ID:** `start-wizard-btn`
  - **Colour:** Ruling planet **primary** only (see §10). Used for:
    - `.aries-cta` (or `.{sign}-cta`) `background`
    - `.contract-card` `border` (same hex)

**CSS (sign-specific):**  
Page class, container max-width, hero H1 (e.g. 32px, primary colour, centred), hook (serif, ~20px, centred), CTA wrap (centred), CTA button (padding, border-radius, font, **background = planet primary**), CTA hover (e.g. opacity 0.9).

---

## 4. Wizard Wrapper (Expandable)

- **Wrapper:** `#wizard-wrap`, class e.g. `wizard-wrap`. Default `display: none`; when CTA clicked add class `open` → `display: block`. No timer; static text only.
- **Top row:**
  - Left: **Progress:** `Step 1 of 7` (updates to Step N of 7), `id="wizard-progress"`, `aria-live="polite"`.
  - Right: **Tentative time:** `~3 Minutes`, `id="wizard-timer"`.
- **No micro-copy** (e.g. no “First instinct. Keep it clean.”).
- **Steps:** 7 wizard steps + 1 final contract step. Only one step visible at a time (`.wizard-step.active`). Step IDs: `#step-1` … `#step-7`, `#step-contract`.

---

## 5. Asc Ritual — 7 Steps (Fixed Structure, Variable Copy/Chips)

Each step has:
- One **question** (`<h3>`).
- Optional **helper** lines (`<p class="helper">`).
- **Input(s)** and/or **chips** as specified.
- **Actions:** `Back` (ghost) + `Next`, or on step 7: `Back` + `Create contract`.

### Step 1 — Choose Your Battlefield

- **Question (h3):** e.g. `Where will you apply discipline?`
- **Helper:** e.g. `Choose one below or type your own.`
- **Visible input:**  
  `id="input-battlefield"`, placeholder e.g. `Choose one or type your battlefield`, `autocomplete="off"`.
- **Hidden input:** `id="field-battle"`, `value=""` (synced when chip selected or user types).
- **Chips:** Exactly 5 options; each `class="wizard-chip"` with `data-value="Label"`.  
  **Aries example:** Work execution, Conflict control, Spending control, Health discipline, Social restraint.  
  **Behaviour:** Clicking a chip sets both `#field-battle` and `#input-battlefield`, adds `.active` to that chip. Typing in input syncs to hidden field and clears chip active state.
- **Buttons:** Only `Next` (`id="next-1"`).

### Step 2 — Define What Stops

- **Question (h3):** e.g. `What behavior ends today?`
- **Input:** `id="input-stop"`, placeholder e.g. `Describe one behavior only`.
- **Helper:** e.g. `Tap an example to use it, or type your own:`
- **Chips:** 5 example behaviours; tap fills `#input-stop`.  
  **Aries example:** Sending reactive messages, Interrupting people, Impulse spending, Escalating arguments, Starting tasks without planning.
- **Helper:** e.g. `Be specific. One behavior only. Choose something visible. Not emotional.`
- **Buttons:** `Back` (`id="back-2"`), `Next` (`id="next-2"`).

### Step 3 — Define The Stop Rule

- **Question (h3):** e.g. `When this behavior is triggered, what is your pause rule?`
- **Input:** `id="input-stop-rule"`, placeholder e.g. `e.g. Wait 10 minutes before responding`.
- **Helper:** e.g. `Tap to use or edit:`
- **Chips:** 5 template phrases.  
  **Aries example:** Wait 10 minutes before responding, Count to 20 before speaking, Step away physically, Write but do not send, Take 3 slow breaths.
- **Helper:** e.g. `This must happen immediately when triggered.`
- **Buttons:** `Back` (`id="back-3"`), `Next` (`id="next-3"`).

### Step 4 — Define What Starts

- **Question (h3):** e.g. `What daily discipline will you apply for 43 days? (≤ 15 minutes)`
- **Input:** `id="input-daily"`, placeholder e.g. `e.g. 10 min planning before work`.
- **Chips:** 5 daily-action templates.  
  **Aries example:** 10 min planning before work, 10 min strength training, 10 min finance review, 10 min journaling, 10 min reviewing priorities.
- **Duration:**  
  `<select id="duration">` with options `5`, `10`, `15` (value and label “5 min”, “10 min”, “15 min”). Default selected: 10.
- **Buttons:** `Back` (`id="back-4"`), `Next` (`id="next-4"`).

### Step 5 — Fix The Time

- **Question (h3):** e.g. `When will you do this daily?`
- **Hidden:** `id="time-choice"` (stores Morning / Afternoon / Evening).
- **Chips:** Exactly 3: `Morning`, `Afternoon`, `Evening` (no “Fixed time”). Click sets `#time-choice` and adds `.active` to chip.
- **Bold line:** `<p class="wizard-same-time">Same time. Every day.</p>` (no extra time input).
- **Buttons:** `Back` (`id="back-5"`), `Next` (`id="next-5"`).

### Step 6 — Minimum Standard

- **Question (h3):** e.g. `On your worst day, what is the smallest version you will still complete?`
- **Prompt line (above input):** `<p class="wizard-prompt-line">"I will at least ______."</p>`
- **Input:** `id="input-min-standard"`, placeholder e.g. `e.g. Wait 1 minute, write 1 line`.
- **Helper:** e.g. `Examples: Wait 1 minute, write 1 line, do 5 pushups, review one expense.`
- **Buttons:** `Back` (`id="back-6"`), `Next` (`id="next-6"`).

### Step 7 — Consequence

- **Question (h3):** e.g. `If you ignore your rules for 3 days, what happens?`
- **Prompt line (above input):** `<p class="wizard-prompt-line">"I will ______."</p>`
- **Input:** `id="input-consequence"`, placeholder e.g. `e.g. "Restart from Day 1"`.
- **Helper:** e.g. `Examples: Restart from Day 1, add 5 extra days, remove one comfort, donate ₹___.`
- **Buttons:** `Back` (`id="back-7"`), `Create contract` (`id="finish-wizard"`).

---

## 6. Final Contract Step

- **Heading:** `Our 43-Day Contract` (no emoji, no “Fire”).
- **Card:** Same planet primary colour as CTA for **border** (e.g. `border: 2px solid #E63946`). Background e.g. `var(--white)`.
- **Rows (fixed labels):**  
  Each row: `.label` (uppercase, small) + `.value` with `id="out-{field}"`.  
  Fields in order:
  1. **Battlefield** — `id="out-battlefield"`
  2. **What Stops** — `id="out-stop"`
  3. **Pause Rule** — `id="out-stop-rule"`
  4. **Daily Discipline** — `id="out-daily"`
  5. **Time** — `id="out-time"` (e.g. “Morning, 10 min” or “Evening, 15 min”)
  6. **Minimum Standard** — `id="out-min-standard"`
  7. **Consequence** — `id="out-consequence"`
- **Actions (no-print):**  
  - `Copy checklist` (`id="copy-checklist"`)  
  - `Download .txt` (`id="download-txt"`)  
  - `Print` (`id="print-contract"`)
- **Tracker block (no-print):**
  - Heading: `Download Your 43-Day Tracker`
  - Label: `Email address`
  - Input: `id="tracker-email"`, `type="email"`, placeholder e.g. `you@example.com`, `autocomplete="email"`
  - Button: `Get My Tracker` (`id="get-tracker-btn"`)

---

## 7. Accordions (Below Wizard, Same Order Every Time)

- **Container:** e.g. `.{sign}-accordions`.
- **Count:** 4 accordions. Closed by default. Same structure each: toggle button + panel with content.
- **Section titles (plug-and-play copy per sign):**
  1. **Where {Sign} Leaks Power** (or equivalent “where this sign loses energy”)
  2. **Where Obstruction Shows Up (Social & Group Friction)** (or sign-specific obstruction)
  3. **Why Discipline Beats Motivation**
  4. **Read the Rules**

Content: short paragraphs (e.g. 5–6 lines max per section), no essay walls. Use `<p>` per line or short block.

**CSS:** Toggle (full width, serif, primary colour), panel `max-height: 0` / `700px` when `.expanded`, content padding, Comfortaa for body.

---

## 8. Data Model & Storage

- **localStorage key:** `{sign}_fire_reset` or `{sign}_reset` (e.g. `aries_fire_reset`). One key per sign so each sign’s progress is separate.
- **getData()** must return an object with exactly these keys (and any extra you use for UI only):
  - `battlefield` — from `#input-battlefield` or `#field-battle`
  - `stopBehavior` — from `#input-stop`
  - `stopRule` — from `#input-stop-rule`
  - `dailyDiscipline` — from `#input-daily`
  - `duration` — from `#duration` (“5” | “10” | “15”)
  - `timeChoice` — from `#time-choice` (“Morning” | “Afternoon” | “Evening”)
  - `minStandard` — from `#input-min-standard`
  - `consequence` — from `#input-consequence`

**buildContract()** fills each `#out-{field}` from the same-named property; **Time** is built as `timeChoice + ", " + duration + " min"` (e.g. `Morning, 10 min`).

**Copy checklist / Download .txt:** Same fields in same order as contract card; use getData() and a fixed label list.

**Auto-save:** On every step change and on chip/input change, call save() which writes getData() + current step to localStorage. **load()** on DOMContentLoaded restores into inputs and restores active chip state for Step 1 and Step 5.

---

## 9. IDs & Script Hooks (Checklist)

- CTA: `#start-wizard-btn` → toggle `#wizard-wrap.open`, scroll into view.
- Progress: `#wizard-progress` → text “Step N of 7”.
- Steps: `#step-1` … `#step-7`, `#step-contract`; showStep(n) / showStep('contract').
- Next/Back: `#next-1`, `#back-2`, `#next-2`, … `#back-7`, `#finish-wizard`.
- Chips: bind by selector (e.g. `#chips-s1`, `#chips-s2`, …) to the corresponding input or hidden field; Step 1 and Step 5 also need `.active` toggle.
- Contract: `#out-battlefield`, `#out-stop`, `#out-stop-rule`, `#out-daily`, `#out-time`, `#out-min-standard`, `#out-consequence`.
- Actions: `#copy-checklist`, `#download-txt`, `#print-contract`; tracker: `#tracker-email`, `#get-tracker-btn` (handler optional).
- Accordions: each `.aries-accordion` (or `.{sign}-accordion`) with toggle and panel; click toggle toggles `.expanded`.

---

## 10. Planet Ruler → Primary Colour (CTA & Contract Border)

Use **primary** only for the CTA button background and the contract card border.

| Sign      | Ruler   | Primary (hex) |
|-----------|---------|----------------|
| Aries     | Mars    | `#E63946`      |
| Taurus    | Venus   | `#E3F2FD`      |
| Gemini    | Mercury | `#06A77D`      |
| Cancer    | Moon    | `#F5E6D3`      |
| Leo       | Sun     | `#FF6B35`      |
| Virgo     | Mercury | `#06A77D`      |
| Libra     | Venus   | `#E3F2FD`      |
| Scorpio   | Mars    | `#E63946`      |
| Sagittarius | Jupiter | `#F7B801`    |
| Capricorn | Saturn  | `#1A1A1A`      |
| Aquarius  | Saturn  | `#1A1A1A`      |
| Pisces    | Jupiter | `#F7B801`      |

*(Rahu/Ketu not used as sole rulers for the 12 signs in this table; if you add nodes later, use Rahu `#4A4A4A`, Ketu `#6C757D`.)*

For light primaries (e.g. Venus, Moon), ensure CTA text and borders are still readable (e.g. dark text on light background or darker border).

---

## 11. What You Change Per Sign (Plug-and-Play List)

- **File name:** `practice/ascendant-reset/{sign}.html`.
- **Title & meta:** “{Sign} Ascendant: 43-Day Reset”, description mentioning sign.
- **Canonical:** `https://ireadspace.com/practice/ascendant-reset/{sign}`.
- **H1:** `{Sign} Ascendant: 43-Day Reset`.
- **Hook:** Two lines (sign-specific).
- **CTA & contract border:** Planet primary colour from §10.
- **Step 1 chips:** 5 battlefield options (sign-specific).
- **Step 2 chips:** 5 “what stops” examples (sign-specific).
- **Step 3 chips:** 5 pause-rule templates (sign-specific).
- **Step 4 chips:** 5 daily-discipline templates (sign-specific).
- **Step 5:** Same (Morning/Afternoon/Evening only).
- **Step 6–7:** Same prompt lines; example helper text can be sign-tuned.
- **Accordion 1–4 titles and body:** Sign-specific (Where sign leaks power, obstruction, discipline vs motivation, rules).
- **localStorage key:** `{sign}_fire_reset` or `{sign}_reset`.
- **Class names:** Optional: keep `aries-` or switch to `.{sign}-` for page/hero/accordion/CTA (and update CSS and JS selectors).

---

## 12. Universal Sections (Landing Page Only)

On **reset-now.html** only, the four accordions below the sign grid are **universal** (same for all signs):

1. **What This Is**
2. **Why 43 Days**
3. **How This Works**
4. **Who This Is Not For**

Do not duplicate these on each sign page. Each sign page has only its **four sign-specific** accordions described in §7.

---

This structure is the single source of truth for building or cloning Asc pages and Asc rituals across all 12 signs.
