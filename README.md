# Wheelhouse Bike Repair - Website Rebuild And Accessibility Upgrade

This repository contains the mobile-first, WCAG 2.2 Level AA rebuild of the Wheelhouse Bike Repair website in Adum, Kumasi, including the mobile layout sketch, root-cause diagnosis of the legacy site, workshop design system documentation, and EE02 accessibility audit artefacts.

---

## Live Site, Run Locally And Required Assets

- **Live website:** [https://emma-ephrim.github.io/wheelhouse-bike-repair/](https://emma-ephrim.github.io/wheelhouse-bike-repair/)
- **Run locally (no build step required):**
  ```bash
  git clone [https://github.com/emma-ephrim/wheelhouse-bike-repair.git](https://github.com/emma-ephrim/wheelhouse-bike-repair.git)
  cd wheelhouse-bike-repair
  python3 -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser (or open `index.html` directly).
- **Required repository assets (needed for a fresh clone to render the site and Markdown docs):**
  - `images/workshop-hero.jpg` (`123 KB` - hero photograph of Kwame inside the Adum workshop)
  - `images/kwame-journey.jpg` (`120 KB` - split photograph showing Kwame's yard-to-workshop growth)
  - `images/sketch.png` (`105 KB` - mobile layout wireframe rendered in Section 1 of this README)
  - `docs/ee02/evidence/` (annotated audit screenshots referenced in `docs/ee02/audit-of-qcalvin3.md`)
- **Asset compression and font performance verification:**
  - Workshop photographs were resized to a `960px` maximum width, stripped of EXIF metadata, and saved as progressive JPEGs with ImageMagick:
    ```bash
    mogrify -resize "960x>" -strip -interlace Plane -sampling-factor 4:2:0 -quality 74 images/workshop-hero.jpg images/kwame-journey.jpg
    ```
  - Verify exact asset sizes on disk:
    ```bash
    ls -lh images/workshop-hero.jpg images/kwame-journey.jpg images/sketch.png
    # workshop-hero.jpg: 123 KB | kwame-journey.jpg: 120 KB | sketch.png: 105 KB
    ```
  - Web fonts (`Balsamiq Sans` and `Inter`) use `preconnect` hints and load with `&display=swap` (`font-display: swap`) alongside `system-ui` fallbacks in `css/styles.css` so text never blocks rendering on slow mobile data.

---

## 1. Page Structure Sketch

### Three Things a Customer Must Learn Within Five Seconds

| Priority | What the customer must learn                                                         | Why it matters for Kwame's customers                                                                                                            | Where it sits in the layout                                                                                                                                                                                                                    |
| :------- | :----------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Are they open right now, where are they in Adum, and how do I reach them in one tap? | Stranded riders search on their phones needing a repair today and will not hunt for plain-text phone numbers or buried addresses.               | Sticky top header (`Call Shop` and `WhatsApp` buttons), live GMT `#shop-status` pill, hero lead (`Shop 4, Adum Commercial Area, Kumasi`), and `Get Directions` button.                                                                         |
| 2        | Can I trust this workshop over competitors down the road?                            | Riders compare two or three shops side by side on their phones and choose the workshop that looks established, transparent, and competent.      | Hero workshop photograph of Kwame, overlapping `.proof-scoreboard` (`Since 2019`, `GH₵ 60+`, `7-Day Tune`), Kwame's yard-to-Adum growth story and local reviews (`#trust`), and `Common Questions` (`#faq`) all placed above the booking form. |
| 3        | Can they fix my specific bike problem today, and what will it cost?                  | Customers with a flat tyre, broken chain, or neglected bike want upfront starting prices and clear turnaround expectations before walking over. | `Send Photo on WhatsApp` quick-check banner and `Repair Services and Upfront Pricing` (`#services`) immediately below the hero.                                                                                                                |

### Mobile Layout Sketch

![Mobile Layout Sketch](./images/sketch.png)

### Why the Page Is Ordered This Way (And Refinements Made During Build)

Customers looking up Wheelhouse are usually standing on the roadside in Kumasi on a mobile phone comparing two or three repair shops in bright sunlight:

1. **Immediate Action And Real Workshop Identity (Header And Hero):** The sticky header keeps one-tap `tel:0322000000` (`Call Shop`) and `https://wa.me/233244000001` (`WhatsApp`) buttons reachable with one thumb alongside an accessible `Menu` toggle. The hero pairs a compressed photograph of Kwame working inside his modern Adum workshop (`images/workshop-hero.jpg`, `123 KB`) with a live Ghana Standard Time (`Africa/Accra`) open/closed pill and an overlapping scoreboard (`Since 2019`, `GH₵ 60+`, `7-Day Tune`).
2. **Roadside Triage And Upfront Pricing (`#services`):** Directly below the hero, a warm callout banner lets unsure riders send a quick photo on WhatsApp to confirm part stock before walking over, followed by six scannable service cards with crisp SVG icons and upfront starting prices (`From GH₵ 60`).
3. **Competitor-Beating Credibility Before Booking (`#trust` And `#faq`):** Rather than burying Kwame's 2019 workshop history at the bottom of the page, `Why Kumasi Riders Choose Wheelhouse` pairs Kwame's story and before-and-after workshop photo (`images/kwame-journey.jpg`, `120 KB`) with local rider reviews from Adum, KNUST, and Bantama right above `Common Questions`, answering every trust question before asking visitors to visit or book.
4. **Visually Distinct Location vs. Policy Panels (`#location`) And Dual-Purpose Form (`#booking`):** `Find the Workshop and Drop-Off Rules` separates the dark charcoal shop directory (with an Adum Post Office landmark cue and direct `Open in Google Maps` link) from the warm tinted `1-2-3` walk-in policy card so the two never blend together at a glance. Finally, the consolidated form uses a `<fieldset>` mode switch so customers can either **Book a Repair Drop-Off** or **Ask a Question / Check Parts**.
5. **Typography Refinement Note:** The initial sketch uses `Balsamiq Sans` to establish an approachable, human workshop personality. During implementation, `Balsamiq Sans` (`700`) was retained on the brand title, all headings (`h1` to `h3`), scoreboard stats, prices, and FAQ triggers, while `Inter` (`400` to `700`) was paired for body paragraphs, labels, and buttons so dense pricing details and form inputs stay sharp in outdoor glare and at `400%` browser zoom.

---

## 2. Diagnosis of the Legacy Website (Symptom vs. Root Cause)

| Symptom                                                                                            | Technical root cause in legacy code                                                                                                          | Evidence from legacy `index.html` and `styles.css`                                                                                                                                                            | Who is affected                                                                                                              | Cost to Kwame's business                                                                                                  |
| :------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| Desktop page shrinks into tiny unreadable text or scrolls sideways on phones.                      | Missing viewport meta tag, fixed `960px` container widths, and fixed-width floated columns.                                                  | No `<meta name="viewport">` in `<head>`; hardcoded `width: 960px` on `#topnav`, `#headerbanner`, `#pagewrap`, `#pagefooter`; `float: left; width: 280px` on `.service-box` and inline `380px`/`360px` floats. | Mobile riders searching in a hurry on the roadside and low-vision users zooming to `400%`.                                   | Stranded cyclists will not pinch-zoom and pan across a broken desktop layout in the sun; they bounce to a competing shop. |
| Customers cannot tap to call or find the shop without scrolling through the whole page.            | Inverted DOM order, dead `#` navigation links, and plain-text phone numbers without `tel:` or `wa.me` URIs.                                  | Shop address and hours sat near the bottom of `#pagewrap`; `#topnav` used `href="#"` placeholders; `0322 000 000` and `0244 000 001` were unlinked text.                                                      | One-handed mobile users or riders with grease on their hands trying to call or get directions quickly.                       | Extra friction at the exact moment a customer wants to walk in or confirm part availability costs immediate walk-in jobs. |
| Washed-out text in daylight, broken keyboard/screen-reader navigation, and rainbow visual clutter. | Generic `<div>` soup, skipped heading levels, `<br>` layout spacing, `11px-12px` pixel fonts, and six conflicting inline border colors.      | Zero semantic landmarks (`<header>`, `<nav>`, `<main>`, `<address>`, `<footer>`); `<h1>` jumped straight to `<h3>`; static `<div class="faq-trigger">` blocks; six inline rainbow `border-top` hex codes.     | Screen reader users, keyboard-only users, and anyone viewing the site outdoors in Kumasi sunlight.                           | Cluttered rainbow borders and tiny grey text undermine trust when compared side by side against other workshops.          |
| Both forms fail to submit requests and the second form spills outside the page container.          | Dead `<input type="button">` controls with no submit handler, missing `<label>` elements, and `#contact-section` placed outside `#pagewrap`. | Both forms used `<input type="button">` instead of `<button type="submit">`; inputs relied on disappearing placeholders with no `<label for="...">`; `#contact-section` had no layout rules.                  | Any customer trying to book a repair or ask whether a spare part is in stock, especially one-handed or assistive-tech users. | Customers lose typed details with zero confirmation and Kwame never receives online leads or part inquiries.              |

---

## 3. Design System And Self-Audit of the Finished Page

### Workshop Design System (Colour Palette, Type Scale And Spacing)

To give Wheelhouse a clean, trustworthy look suited to a real trade workshop, `css/styles.css` defines a structured set of tokens:

- **Colour Palette (Deep Charcoal, Burnt Orange And Accessible Green):**
  - **Landmark Surfaces:** Deep Charcoal (`#121316` on the sticky header and footer; `#1c1e24` with a `#232730` top shelf on the navigation bar, hero, and location directory card) is softer than pure black and clearly separates key sections from the alternating `#ffffff` and soft slate (`#f4f5f7`) reading areas (`#ffffff` on `#121316` = **18.5:1** contrast).
  - **Action And Highlight Colours:** Burnt Orange (`#c2410c`, hover `#9a3412`, soft tint `#fff7ed`) gives mobile visitors one unmistakable colour for primary buttons, navigation hover highlights, prices, and priority repair cards (`#ffffff` on `#c2410c` = **5.18:1** contrast). Darkened WhatsApp Green (`#15803d`, **5.02:1** with white text) keeps the familiar WhatsApp cue readable in bright sunlight, paired with Signal Gold focus rings (`#facc15`, **12.85:1** on `#121316`) on dark backgrounds.
  - **Sunlight-Safe Copy And Input Borders:** Primary copy uses `#111827` on `#ffffff` (**17.7:1**) and secondary copy uses `#374151` (**10.3:1** on white, **9.4:1** on `#f4f5f7`). Form inputs use `2px solid #4b5563` borders (**7.56:1** contrast).
- **Deliberate Type Scale (`rem`-based, rooted at `html { font-size: 100%; }`):**
  - **Font Pairing:** `Balsamiq Sans` (`700`) gives headings, scoreboard numbers, and prices a friendly local-shop character, while `Inter` (`400` to `700`) keeps paragraphs, form labels, and buttons crisp on small screens (both loaded with `font-display: swap`).
  - **Scale:** `h1` `2.15rem` on mobile (`2.75rem` at `900px+`), scoreboard stats `1.95rem`, `h2` `1.65rem`, `h3` `1.2rem`, prices `1.15rem`, hero lead `1.05rem`, body and inputs `1rem`, buttons and nav links `0.875rem-0.95rem`, and status/tag pills `0.75rem-0.84rem`.
- **8px Modular Spacing System:** Built on six `rem` tokens (`--space-1: 0.5rem / 8px`, `--space-2: 1rem / 16px`, `--space-3: 1.5rem / 24px`, `--space-4: 2rem / 32px`, `--space-5: 3rem / 48px`, `--space-6: 4rem / 64px`), a shared `--scoreboard-overlap: 2rem` bridge token, `12px` card radii, `8px` control radii, and a `1080px` max-width container.

### Written Audit of the Finished Page

1. **Semantic HTML:** Replaced the legacy `<div>` and `<br>` layout with meaningful structure: `<header>`, `<nav aria-label="Main Navigation">`, `<main id="main-content">`, `<section>` blocks with ordered `<h1>` to `<h3>` headings (no skipped levels), `<figure>` and `<figcaption>` for Kwame's workshop photographs, `<article>` for service and review cards, native `<details>` and `<summary>` for FAQs, `<address>` for shop contact details, `<aside>` with `<ol>` for walk-in rules, `<fieldset>` and `<legend>` inside the consolidated `<form>`, and `<footer>`.
2. **Baseline And WCAG 2.2 AA Accessibility:** Every text and button pairing exceeds `4.5:1` contrast (`5.02:1` to `18.5:1`), form borders (`7.56:1`) and `:focus-visible` rings (`5.18:1` orange on light sections, `12.85:1` gold on dark sections) exceed `3:1`, the skip link uses the `clip` / `clip-path` visually-hidden pattern, `#menu-toggle` updates both `aria-expanded` and its `Open menu` / `Close menu` `aria-label`, tap targets meet a `44px` minimum height, form fields include visible `(required)` labels and `autocomplete` attributes, and live updates on `#shop-status` and `#booking-list` use `aria-live="polite"`. `scroll-padding-top`, a scoped `focusin` scroll guard, and a bottom `@media (max-height: 520px), (max-width: 360px)` rule prevent the header from hiding focused buttons on `Shift+Tab` or blocking half the screen at `400%` zoom.
3. **Visual Consistency:** Replaced the legacy site's six competing inline rainbow stripes with clean `12px` rounded cards, subtle `1px` borders, and soft shadows. Extra visual weight is reserved for clear hierarchy: warm `#fdba74` borders on the three main walk-in repairs, burnt-orange hover highlights in the navigation bar, rounded pill badges for live opening status and turnaround times, highlighted active radio options (`.is-selected` plus `:has()`), left-accented green and red `.form-feedback` banners, and contrasting dark (`#1c1e24`) vs. warm (`#fff7ed`) panels in `#location`.

### What I Prioritised And Why (Given Kwame's Constraints)

Customers searching for Wheelhouse need a broken bike fixed today and compare two or three Kumasi workshops side by side on their phones. Given Kwame's preference for **trust over trendiness**, I prioritised:

1. **Five-second mobile clarity and one-tap contact** (putting `Call Shop`, `WhatsApp`, live Kumasi opening status, Adum location, and compressed real-world workshop photography at `123 KB` and `120 KB` above heavy carousels or decorative animations that slow down mobile data).
2. **Upfront price transparency and local proof before the form** (`From GH₵ 60` rates, `Since 2019` growth story, `7-Day Tune` guarantee, and local Kumasi reviews placed above `#booking`) because strangers only call or visit once they trust the mechanic and know the cost.
3. **Resilient progressive enhancement** (native `<details>` FAQs, standard `tel:` and `wa.me` links, and a mobile menu and status pill that still show static hours and navigation links if JavaScript fails on a weak connection).

---

## 4. Additional Business Improvement Beyond the Brief

### One-Tap WhatsApp Photo Check, Live Kumasi Status And Dual-Mode Inquiry Flow

- **What I implemented:** Directly below the hero scoreboard, I added a roadside triage banner (`Stranded or unsure which part your bike needs?`) with a pre-filled `Send Photo on WhatsApp` link, paired with a timezone-locked (`Africa/Accra`) live open/closed pill derived from markup attributes (`data-open`, `data-close`, `data-days`) and a two-mode radio switch (`Book a Repair Drop-Off` vs. `Ask a Question / Check Parts`) inside the form.
- **Value for customers:** Everyday riders with a flat tyre, bent gear part, or rusted chain often do not know technical part names or exact tube sidewall sizes. Instead of guessing or typing a long description one-handed on the roadside, they can tap once, snap a photo in WhatsApp, and confirm stock and price before walking over.
- **Value for Kwame's business:** Photo inquiries show Kwame the exact tyre size or drivetrain damage before the rider arrives, saving bench inspection time, preventing wasted trips, and converting hesitant mobile searchers into confirmed jobs instead of losing them to a shop down the road.

---

## 5. EE02 Accessibility Artefacts

- **Peer Audit Conducted (Audit of Calvin Quashie's Site):** [`docs/ee02/audit-of-qcalvin3.md`](./docs/ee02/audit-of-qcalvin3.md) (requires the annotated screenshots in [`docs/ee02/evidence/`](./docs/ee02/evidence/)).
- **Fixes And Further Accessibility Write-Up:** [`docs/ee02/write-up.md`](./docs/ee02/write-up.md).
