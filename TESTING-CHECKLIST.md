# Final testing checklist – I Read Space

Use this for a final pass before launch.

---

## Automated checks (done)
- [x] No HTML/CSS linter errors
- [x] Critical assets exist: `saumya-about.png`, `styles.css`, `js/faq-chat.js`, `js/mobile-menu.js`
- [x] In-page anchors present: `#pricing`, `#areas`, `#contact`, `#about-saumya`, `#reach-out`, `#founder-note`, `#brand-highlights`

---

## Desktop (Chrome / Safari / Firefox)

### Hero
- [ ] Hero loads: headline “Pattern. Precision. Power.” and body “When effort stops working…” / “Astrology reveals your next best move.”
- [ ] Both lines centered; body in 2 lines
- [ ] Planets visible at ~60% opacity; no horizontal scroll
- [ ] “Book a Session” CTA works and scrolls to `#pricing`

### Navigation
- [ ] Logo and nav links work (Home, About, Pricing, Services, Insights, Healing dropdown, Contact)
- [ ] “Book a Session” in header goes to `#pricing`
- [ ] No layout shift or overflow on scroll

### About Saumya
- [ ] Section order: heading → photo (circle + golden ring) → body text
- [ ] Photo: circular, golden circle around it, no black box
- [ ] Heading 34px; name 24px; body 14px (matches Founder’s Note)
- [ ] Divider line above “Often described as” visible

### Core benefits
- [ ] “Clarity” blob shows “Understand issues” (not “Understand patterns”)
- [ ] Other blobs (Precision, Structure) render correctly

### Reach out / Brand / Pricing / FAQ / Founder’s note
- [ ] “Reach out to me when” heading and cards work; links scroll to correct sections
- [ ] Brand highlights (Often described as, Client feedback, Practice principles) visible
- [ ] Pricing cards and “Book Now” go to intake with correct `?duration=`
- [ ] In-page FAQ accordions open/close
- [ ] Founder’s Note: photo, “Saumya Singh”, sections (no “What I bring”), text readable

### Floating FAQ (?)
- [ ] Button visible bottom-right; “?” bold
- [ ] Click opens panel with “Have a Question?” visible at top
- [ ] Categories expand; option buttons show answers
- [ ] Close (×) closes panel
- [ ] Panel doesn’t cover nav or get cut off

### Contact & footer
- [ ] Contact section and WhatsApp / Email / Instagram / LinkedIn work
- [ ] Footer links: Privacy, Refund, Reschedule, Terms
- [ ] “Book a Session” in footer goes to `#pricing`

---

## Mobile (portrait, ~375px and ~414px)

### Hero
- [ ] Headline one line (or wraps cleanly); body 2 lines or wraps without being cut off
- [ ] Planets visible; opacity ~60%; horizontal scroll if needed
- [ ] CTA tappable and scrolls to pricing

### Nav
- [ ] Hamburger opens menu; links work; “Book a Session” works
- [ ] Menu closes after tap/selection

### About / Reach out / Brand
- [ ] About: photo and text stack; photo centered; divider visible
- [ ] Reach out cards stack; tappable
- [ ] Brand section readable

### Floating FAQ
- [ ] Panel opens below the nav (heading “Have a Question?” visible, not under nav)
- [ ] Panel uses most of width; no horizontal scroll
- [ ] Header, categories, options, and answers readable and tappable
- [ ] Close button works

### General mobile
- [ ] No horizontal scroll on the page (except planets if intended)
- [ ] All CTAs and links easily tappable
- [ ] Text readable without zooming

---

## Cross-browser
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Firefox (desktop)

---

## Optional
- [ ] Run Lighthouse (Performance, Accessibility, Best Practices)
- [ ] Test with slow 3G in DevTools
- [ ] Check `about.html`, `faq.html`, `intake.html` if you use them in this release
