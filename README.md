# Wheelhouse Bike Repair - Website Rebuild & Accessibility Upgrade

This repository contains the mobile-first, WCAG 2.2 Level AA rebuild of the Wheelhouse Bike Repair website in Adum, Kumasi, including the mobile layout wireframe, root-cause diagnosis of the legacy site, design system documentation, and EE02 accessibility audit artefacts.

---

## 1. Page Structure Sketch (Understand)

### Three Things a Customer Must Learn Within Five Seconds

| Priority | What the customer must learn                                                         | Why it matters for Kwame's customers                                                                                                            | Where it sits in the layout                                                                                                                                                                                                |
| :------- | :----------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Are they open right now, where are they in Adum, and how do I reach them in one tap? | Stranded riders search on their phones needing a repair today and will not hunt for plain-text phone numbers or buried addresses.               | Sticky top header (`Call Shop` and `WhatsApp` buttons), live GMT `#shop-status` pill, hero lead (`Shop 4, Adum Commercial Area, Kumasi`), and `Get Directions` CTA.                                                        |
| 2        | Can I trust this workshop over competitors down the road?                            | Riders compare two or three shops side by side on their phones and choose the workshop that looks established, transparent, and competent.      | Hero workshop photograph of Kwame truing a wheel, overlapping `.proof-scoreboard` (`Since 2019`, `GH₵ 60+`, `7-Day Tune`), customer reviews (`#trust`), and `Common Questions` (`#faq`) all placed above the booking form. |
| 3        | Can they fix my specific bike problem today, and what will it cost?                  | Customers with a flat tyre, broken chain, or neglected bike want upfront starting prices and clear turnaround expectations before walking over. | `Send Photo on WhatsApp` quick-check banner and `Repair Services & Upfront Pricing` (`#services`) immediately below the hero.                                                                                              |

### Mobile Layout Sketch

![Mobile Layout Sketch](./images/sketch.png)

### Why the Page Is Ordered This Way (And Refinements Made During Build)

Customers looking up Wheelhouse are usually standing on the roadside in Kumasi on a mobile phone comparing two or three repair shops in bright sunlight:

1. **Immediate Action & Real Workshop Identity (Header + Hero):** The sticky header keeps one-tap `tel:0322000000` (`Call Shop`) and `https://wa.me/233244000001` (`WhatsApp`) buttons reachable with one thumb alongside an accessible `Menu` toggle. The hero pairs a compressed photograph of Kwame working on a bicycle wheel (`images/workshop-hero.jpg`) with a live Ghana Standard Time (`Africa/Accra`) open/closed banner and an overlapping specification scoreboard (`Since 2019`, `GH₵ 60+`, `7-Day Tune`).
2. **Roadside Triage & Upfront Pricing (`#services`):** Directly below the hero, a high-visibility WhatsApp photo-estimate banner lets unsure riders snap a picture of a punctured tyre sidewall or snapped chain to confirm part stock before walking over, followed by six scannable service cards with mechanical SVG icons and upfront starting prices (`From GH₵ 60`).
3. **Competitor-Beating Credibility Before Booking (`#trust` & `#faq`):** Rather than burying Kwame's 2019 workshop history at the bottom of the page, `Why Kumasi Riders Choose Wheelhouse` (Kwame's personal supervision and local rider reviews from Adum, KNUST, and Bantama) and `Common Questions` sit above the form so visitors have every trust question answered before deciding to visit or book.
4. **Visually Distinct Location vs. Policy Panels (`#location`) & Dual-Purpose Form (`#booking`):** `Find the Workshop & Drop-Off Rules` separates the dark asphalt shop directory (with a landmark cue and direct `Open in Google Maps` link) from the warm amber `1-2-3` walk-in policy card so the two never blend together at a glance. Finally, the consolidated form uses a `<fieldset>` mode switch so customers can either **Book a Repair Drop-Off** or **Ask a Question / Check Parts**.
5. **Typography Refinement Note:** The wireframe uses `Balsamiq Sans` to establish an approachable, human-crafted shop personality. During implementation, `Balsamiq Sans` (`700`) was retained on the brand title, all headings (`h1`–`h3`), scoreboard stats, prices, and FAQ triggers, while `Inter` (`400`–`700`) was paired for body paragraphs, labels, and buttons so dense pricing details and form inputs remain crisp in outdoor glare and at `400%` browser zoom.

---

## 2. Diagnosis of the Legacy Website (Analyse: Symptom vs. Root Cause)

| Symptom                                                                                            | Technical root cause in legacy code                                                                                                          | Evidence from legacy `index.html` & `styles.css`                                                                                                                                                              | Who is affected                                                                                                              | Cost to Kwame's business                                                                                                  |
| :------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| Desktop page shrinks into tiny unreadable text or scrolls sideways on phones.                      | Missing viewport meta tag, fixed `960px` container widths, and fixed-width floated columns.                                                  | No `<meta name="viewport">` in `<head>`; hardcoded `width: 960px` on `#topnav`, `#headerbanner`, `#pagewrap`, `#pagefooter`; `float: left; width: 280px` on `.service-box` and inline `380px`/`360px` floats. | Mobile riders searching in a hurry on the roadside and low-vision users zooming to `400%`.                                   | Stranded cyclists will not pinch-zoom and pan across a broken desktop layout in the sun; they bounce to a competing shop. |
| Customers cannot tap to call or find the shop without scrolling through the whole page.            | Inverted DOM order, dead `#` navigation links, and plain-text phone numbers without `tel:` or `wa.me` URIs.                                  | Shop address and hours sat near the bottom of `#pagewrap`; `#topnav` used `href="#"` placeholders; `0322 000 000` and `0244 000 001` were unlinked text.                                                      | One-handed mobile users or riders with grease on their hands trying to call or get directions quickly.                       | Extra friction at the exact moment a customer wants to walk in or confirm part availability costs immediate walk-in jobs. |
| Washed-out text in daylight, broken keyboard/screen-reader navigation, and rainbow visual clutter. | Generic `<div>` soup, skipped heading levels, `<br>` layout spacing, `11px–12px` pixel fonts, and six conflicting inline border colors.      | Zero semantic landmarks (`<header>`, `<nav>`, `<main>`, `<address>`, `<footer>`); `<h1>` jumped straight to `<h3>`; static `<div class="faq-trigger">` blocks; six inline rainbow `border-top` hex codes.     | Screen reader users, keyboard-only users, and anyone viewing the site outdoors in Kumasi sunlight.                           | Cluttered rainbow borders and tiny grey text undermine trust when compared side by side against other workshops.          |
| Both forms fail to submit requests and the second form spills outside the page container.          | Dead `<input type="button">` controls with no submit handler, missing `<label>` elements, and `#contact-section` placed outside `#pagewrap`. | Both forms used `<input type="button">` instead of `<button type="submit">`; inputs relied on disappearing placeholders with no `<label for="...">`; `#contact-section` had no layout rules.                  | Any customer trying to book a repair or ask whether a spare part is in stock, especially one-handed or assistive-tech users. | Customers lose typed details with zero confirmation and Kwame never receives online leads or part inquiries.              |

---

## 3. Design System & Self-Audit of the Finished Page

### Workshop Design System (Colour Palette, Type Scale & Spacing)

To match a hands-on bicycle workshop without feeling trendy for its own sake, the CSS custom properties in `css/styles.css` define a grounded three-part system:

- **Colour Palette (Carbon Asphalt & Burnt Cycling Orange):**
  - **Workshop Surfaces:** Deep Tire Asphalt (`#121316` header/footer and `#1c1e24` hero/location card) paired with crisp white (`#ffffff`) and muted slate (`#f4f5f7`) alternating sections so visitors can scan distinct blocks outdoors.
  - **Action & Priority Accent:** Burnt Cycling Orange (`#c2410c`, hover `#9a3412`, warm tint `#fff7ed`) reserved strictly for primary CTAs, prices, and priority `4px` top borders, alongside accessible WhatsApp green (`#15803d`) and Signal Gold focus rings (`#facc15` on dark surfaces).
  - **Sunlight-Safe Text & Control Borders:** `#111827` primary text (`17.7:1` on white), `#374151` secondary text (`10.3:1` on white, `9.4:1` on `#f4f5f7`), and `2px solid #4b5563` form field borders (`7.56:1`).
- **Deliberate Type Scale (`rem`-based, rooted at `html { font-size: 100%; }`):**
  - **Font Pairing:** `Balsamiq Sans` (`700`) gives headings, prices, and scoreboard figures a warm, approachable workshop character, while `Inter` (`400`–`700`) keeps body copy, labels, and buttons effortless to read on small screens.
  - **Scale:** `h1` `2.15rem` on mobile (`2.75rem` at `900px+`), scoreboard stats `1.95rem`, `h2` `1.65rem`, `h3` `1.2rem`, prices `1.15rem`, hero lead `1.05rem`, body and inputs `1rem`, buttons and nav links `0.875rem–0.95rem`, and status/tag kickers `0.78rem–0.85rem`.
- **8px Modular Spacing System:** Built on six CSS tokens (`--space-1: 0.5rem / 8px`, `--space-2: 1rem / 16px`, `--space-3: 1.5rem / 24px`, `--space-4: 2rem / 32px`, `--space-5: 3rem / 48px`, `--space-6: 4rem / 64px`) with consistent `8px` card radii (`--radius`) and a `1080px` max-width container.

### Written Audit of the Finished Page

1. **Semantic HTML:** Replaced the legacy `<div>` and `<br>` layout with landmark and content elements that convey real structure: `<header>`, `<nav aria-label="Main Navigation">`, `<main id="main-content">`, thematic `<section>` blocks with ordered `<h1>`–`<h3>` headings (zero skipped levels), `<figure>` for Kwame's workshop photo, `<article>` for service and review cards, native `<details>`/`<summary>` for FAQs, `<address>` for shop contact details, `<aside>` with `<ol>` for walk-in rules, `<fieldset>`/`<legend>` for the dual-purpose `<form>`, and `<footer>`.
2. **Baseline & WCAG 2.2 AA Accessibility:** Every text and button combination exceeds `4.5:1` (`5.02:1` to `18.5:1`), form borders (`7.56:1`) and custom `:focus-visible` outlines (`5.18:1` orange on light, `12.85:1` gold on dark) exceed `3:1`, tap targets meet `44px` minimum height for one-handed phone use, inputs include explicit `<label>` elements with `(required)` markers and `autocomplete` attributes, and `400%` zoom / `320px` width reflows into a single column with zero horizontal scrolling and an unstuck header.
3. **Visual Consistency:** Eliminated the legacy site's six competing inline rainbow borders and mixed font sizes. Every card, banner, status pill, FAQ item, and feedback alert across the site shares the same top-accent border treatment (`#c2410c` for priority actions/services, `#1c1e24` for standard cards), the same `24px` (`--space-3`) internal card padding, and the same two-colour workshop palette, while the dark location card and warm amber policy card stay visually distinct at first glance.

### What I Prioritised and Why (Given Kwame's Constraints)

Customers searching for Wheelhouse have a broken bike today and are comparing two or three Kumasi workshops side by side on their phones—not browsing for entertainment. Given Kwame's explicit preference for **trust over trendiness**, I prioritised:

1. **Five-second mobile clarity and one-tap contact** (putting `Call Shop`, `WhatsApp`, live Kumasi opening status, Adum location, and a real workshop photo above the fold) ahead of decorative animations, carousels, or multi-page navigation that slow down mobile data connections.
2. **Upfront price transparency and local proof before the form** (`From GH₵ 60` rates, `Since 2019` history, `7-Day Tune` guarantee, and Kumasi rider reviews placed above `#booking`) because strangers only call or walk into a workshop once they trust its competence and pricing.
3. **Resilient progressive enhancement** (native `<details>` FAQs, `tel:`/`wa.me` links, and a mobile menu and status banner that still display static hours and links if JavaScript fails on a weak connection).

---

## 4. Additional Business Improvement Beyond the Brief (Deliverable 5)

### One-Tap "Send Photo on WhatsApp" Pre-Check & Dual-Mode Inquiry Flow

- **What I implemented:** Directly below the hero scoreboard, I built a dedicated roadside triage banner (`Stranded or unsure which part your bike needs?`) with a pre-filled WhatsApp link (`Send Photo on WhatsApp`), paired with a live Ghana Standard Time (`Africa/Accra`) open/closed status pill in the hero and a two-mode radio switch (`Book a Repair Drop-Off` vs. `Ask a Question / Check Parts`) inside the consolidated form.
- **Value for customers:** Everyday commuters with a flat tyre, bent gear hanger, or rusted chain often do not know technical part names or exact tube sidewall sizes. Instead of guessing, typing a long form message one-handed on the roadside, or pushing a heavy bike across Adum only to learn a rare part is out of stock, they can tap once, snap a photo in WhatsApp, and get an immediate answer.
- **Value for Kwame's business:** Pre-filled photo messages give Kwame the exact tyre size or drivetrain damage before the rider arrives—saving bench inspection time, preventing wasted walk-ins, and converting hesitant mobile searchers who would otherwise bounce to the competitor down the road into confirmed jobs.

---

## 5. EE02 Accessibility Artefacts

- **Peer Audit Conducted (Audit of Calvin Quashie's Site):** [`docs/ee02/audit-of-qcalvin3.md`](./docs/ee02/audit-of-qcalvin3.md) (with screenshots in [`docs/ee02/evidence/`](./docs/ee02/evidence/)).
- **Fixes & Further Accessibility Write-Up:** [`docs/ee02/write-up.md`](./docs/ee02/write-up.md).
