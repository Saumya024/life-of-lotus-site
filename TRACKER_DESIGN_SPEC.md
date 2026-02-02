# 30-Day Night & Morning Ritual Tracker — Design Specification

## Overview
A printable A4 tracker for the Night & Morning Rituals program. Users print this, stick it on their wall, and check off each day.

---

## Format
- **Size:** A4 Landscape (297mm × 210mm)
- **Orientation:** Landscape
- **Print margins:** 10mm on all sides
- **File format:** PDF (print-ready, 300 DPI)

---

## Color Palette (I Read Space)
| Name | Hex | Usage |
|------|-----|-------|
| Primary (Deep Purple) | #431039 | Headers, text, accents |
| Secondary (Teal) | #40c0c5 | Highlights, checkboxes |
| Cream White | #F8F6F2 | Background |
| White | #FFFFFF | Card backgrounds |
| Gold | #ba9751 | Week labels |

---

## Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Title | Brygada 1918 | 24pt | 500 |
| Tagline | Comfortaa | 12pt | 300 |
| Week Labels | Comfortaa | 10pt | 500 |
| Day Numbers | Brygada 1918 | 12pt | 400 |
| Symbols | System | 14pt | — |
| Reflection Labels | Comfortaa | 9pt | 400 |
| Footer | Comfortaa | 8pt | 300 |

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  [Logo]     NIGHT & MORNING RITUALS — 30 DAY TRACKER                               │
│             "Your mind runs all day. Give it permission to stop."                   │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  WEEK 1: FOUNDATION                    │  WEEK 2: CONSISTENCY                       │
│  ┌────┬────┬────┬────┬────┬────┬────┐  │  ┌────┬────┬────┬────┬────┬────┬────┐     │
│  │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │  │  │ 8  │ 9  │ 10 │ 11 │ 12 │ 13 │ 14 │     │
│  │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │  │  │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │     │
│  │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │  │  │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │     │
│  └────┴────┴────┴────┴────┴────┴────┘  │  └────┴────┴────┴────┴────┴────┴────┘     │
│  Reflection: ___________________________│  Reflection: __________________________   │
│                                                                                     │
│  WEEK 3: DEEPENING                     │  WEEK 4: OWNERSHIP                         │
│  ┌────┬────┬────┬────┬────┬────┬────┐  │  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┐
│  │ 15 │ 16 │ 17 │ 18 │ 19 │ 20 │ 21 │  │  │ 22 │ 23 │ 24 │ 25 │ 26 │ 27 │ 28 │ 29 │ 30 │
│  │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │  │  │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │ ☾○ │
│  │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │  │  │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │ ☀○ │
│  └────┴────┴────┴────┴────┴────┴────┘  │  └────┴────┴────┴────┴────┴────┴────┴────┴────┘
│  Reflection: ___________________________│  Reflection: __________________________   │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  ☾ = Night ritual complete    ☀ = Morning ritual complete    lifeoflotus.in        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Element Specifications

### Header Section
- **Logo:** Small lotus logo (from assets), positioned top-left, 20mm wide
- **Title:** "NIGHT & MORNING RITUALS — 30 DAY TRACKER"
  - Brygada 1918, 24pt, #431039
  - Centered or left-aligned next to logo
- **Tagline:** "Your mind runs all day. Give it permission to stop."
  - Comfortaa, 12pt, #431039 at 60% opacity
  - Italic style

### Week Blocks

Each week is a contained unit:

#### Week Label
- Format: "WEEK 1: FOUNDATION" (etc.)
- Comfortaa, 10pt, uppercase
- Color: #ba9751 (gold)
- Letter-spacing: 1px

#### Day Cells
- **Size:** 28mm × 28mm per cell (7 cells per week for weeks 1-3, 9 cells for week 4)
- **Background:** White (#FFFFFF)
- **Border:** 1px solid #431039 at 15% opacity
- **Border-radius:** 4px
- **Contents:**
  - Day number: Top-center, Brygada 1918, 12pt, #431039
  - Night checkbox: Middle-left, "☾ ○" 
  - Morning checkbox: Middle-right, "☀ ○"
  - Checkbox circles: 6mm diameter, stroke only (#431039 at 30%)

#### Checkbox Symbols
- ☾ (crescent moon) for night — represents completion of night ritual
- ☀ (sun) for morning — represents completion of morning ritual
- Empty circle ○ next to each — user fills in when complete

#### Reflection Line
- Below each week block
- Label: "Reflection:" in Comfortaa, 9pt
- Line: Thin rule (#431039 at 20%), extends ~80mm

### Week Themes (printed subtly)
- Week 1: Foundation — "Just show up."
- Week 2: Consistency — "Notice resistance."
- Week 3: Deepening — "Feel the shifts."
- Week 4: Ownership — "It's now yours."

These can appear as very light watermarks or small text under each week label.

### Footer Section
- **Legend:** "☾ = Night ritual complete    ☀ = Morning ritual complete"
  - Comfortaa, 9pt, #431039 at 70%
- **URL:** "lifeoflotus.in"
  - Comfortaa, 8pt, #40c0c5
  - Right-aligned

---

## Visual Style Notes

### Overall Aesthetic
- Clean, minimal, breathable
- Warm but not cluttered
- Should look good on a wall (not cheap/disposable)
- Easy to read at arm's length

### Background
- Main background: #F8F6F2 (cream)
- Week blocks float on white cards with subtle shadow

### Shadows
- Day cells: No shadow (flat)
- Week blocks: 2px soft shadow, #431039 at 5%

### Icons
If using custom icons instead of Unicode:
- Crescent moon: Simple, thin stroke
- Sun: Simple circle with short rays
- Style: Line art, consistent 1.5px stroke

---

## Reflection Prompts Card (Bonus)

A separate card (A6 size or quarter-A4) with:

```
WEEKLY REFLECTION PROMPTS

Week 1: What's hardest to let go of at night?

Week 2: What's different when I start mornings slowly?

Week 3: What patterns am I noticing in my energy?

Week 4: What do I want to carry forward?

---

After 30 days, ask yourself:
"What has changed?"

lifeoflotus.in
```

---

## File Deliverables

1. **30-day-ritual-tracker.pdf** — Main A4 landscape tracker
2. **reflection-prompts-card.pdf** — A6 bonus card (optional)
3. **tracker-mockup.jpg** — Lifestyle photo for website (see below)

---

## Lifestyle Mockup Requirements

For the website preview image:

### Setup
- Print the tracker on nice paper (slightly textured if possible)
- Tape/pin to an aesthetic wall (cream, white, or soft grey)
- Add context elements nearby:
  - A small plant or succulent
  - A mug (tea/coffee)
  - A journal or pen
  - Soft morning light from window

### Photo Specs
- Angle: Slight perspective (not flat/straight-on)
- Lighting: Natural, warm (morning light preferred)
- Crop: Include some wall/environment context
- Resolution: At least 1200px wide for web
- Format: JPG, optimized for web (~200KB)

### Vibe
- Calm, intentional, aspirational
- "I want my mornings to look like this"
- Not sterile/stock-photo-ish

---

## Implementation Notes

### Canva
1. Create A4 Landscape document
2. Use "I Read Space" brand kit colors
3. Add custom fonts (Brygada 1918, Comfortaa)
4. Export as PDF Print (300 DPI)

### Figma
1. Frame: 297 × 210mm
2. Use Auto Layout for week grids
3. Create checkbox component for reuse
4. Export as PDF

---

## Email Sequence Integration

When user downloads:
1. **Immediate:** Email with PDF attachment + quick start tips
2. **Day 3:** Check-in email ("First 3 days are hardest...")
3. **Day 7:** Week 1 reflection prompt
4. **Day 14:** Halfway celebration + soft CTA
5. **Day 30:** Completion email + consultation offer

---

## Success Metrics

Track:
- Download count
- Email open rates
- Click-through to consultation page
- Actual consultation bookings (attribute to this funnel)

---

*Design spec created for I Read Space — Night & Morning Rituals Program*






