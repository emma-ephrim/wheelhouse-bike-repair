# EE02 Accessibility Write-Up: Wheelhouse Bike Repair

- **Live site:** https://emma-ephrim.github.io/wheelhouse-bike-repair/
- **Audit received from:** Calvin Nunana Quashie (`16 November 2026`, tested against WCAG 2.2 Level AA)

---

## 1. Fixes Made From the Peer Audit

Calvin's manual keyboard, zoom, Safari/macOS, iPhone one-thumb, and screen-reader (Narrator and VoiceOver) checks caught eight issues that WAVE and Lighthouse missed. Here is what caused each problem and how I fixed it in the code:

### Finding 1: Submitting the form showed a blank "405 Not Allowed" page

- **Cause:** `<form>` had `method="post" action="#booking"` on static GitHub Pages hosting with no JavaScript `submit` handler, so submitting wiped out everything a visitor had just typed one-handed.
- **What I changed:** Removed `method="post"` from `<form class="card booking-form" action="#booking" novalidate>` in `index.html` and added a `submit` listener in `js/script.js`.
- **How it works now:** Submitting valid details stops the page from reloading, shows a clear confirmation message inside `<div id="booking-list" aria-live="polite">` stating whether a **Repair Booking** or **General Question / Part Check** was received, and resets the fields. If any required box is left empty, the script sets `aria-invalid="true"` on the missing inputs, announces the missing field names inside a `role="alert"` message, and moves the cursor straight to the first empty box.

### Finding 2: `Shift+Tab` hid the focused Submit button behind the sticky header

- **Cause:** `.site-header` used `position: sticky; top: 0` with no scroll offset, so tabbing backwards from `#faq` into `#booking` left the focused submit button tucked behind the top bar.
- **What I changed:** Added `scroll-padding-top: 8.5rem` (`6.5rem` on desktop) on `html` and `scroll-margin-top` on `section[id], a, button, input, textarea, summary` in `css/styles.css`. To catch backwards `Shift+Tab` jumps that browsers still under-scroll, I also added a `focusin` check in `js/script.js` that compares the focused element's top edge against `siteHeader.getBoundingClientRect().bottom` and nudges the page clear. Finally, I added a `focusout` listener on `.site-header` so the mobile menu closes automatically when keyboard focus tabs past the last nav link.

### Finding 3: Faint `1.77:1` default focus ring on the dark header in Safari

- **Cause:** Leaving focus outlines up to the browser meant macOS Safari drew its default `#164188` dark blue ring on the dark header (`1.77:1`) and green WhatsApp button (`2.1:1`), both well below the `3:1` minimum needed to see where focus is.
- **What I changed:** Added `:focus-visible` styles in `css/styles.css`: a `3px solid #c2410c` orange outline (`5.18:1` on white) with a `3px` offset on light sections, and a bright `3px solid #facc15` gold outline on `.site-header`, `.hero`, `.location-card`, and `#pagefooter` (`12.85:1` against `#121316`). I also added `<a href="#main-content" class="skip-link">Skip to main content</a>` as the first element in `<body>` so keyboard users can jump straight past the header.

### Finding 4: At `400%` zoom the sticky header blocked half the screen and the menu scrolled sideways

- **Cause:** `.nav-links` previously used `overflow-x: auto` (squeezing `483px` of links into a `320px` screen and hiding `FAQ` and `About` off to the right), while `.site-header` stayed `position: sticky` inside a `320x256` zoomed window (`126px` out of `256px` height).
- **What I changed:**
  1. Replaced the sideways-scrolling strip with a mobile `Menu` button (`<button id="menu-toggle" aria-expanded="false" aria-controls="primary-menu">`) that collapses below `768px`, closes with `Escape` (returning focus to `#menu-toggle`), and stays visible if JavaScript fails to load.
  2. Added `@media (max-height: 520px), (max-width: 360px)` at the very bottom of `css/styles.css` to set `.site-header { position: static; }`, giving zoomed-in visitors the full screen height with zero horizontal scrolling.

### Finding 5: Light `2.84:1` borders on the form inputs

- **Cause:** `#999999` input borders on `#ffffff` measured `2.84:1`, falling short of the `3:1` contrast minimum and washing out in bright Kumasi daylight.
- **What I changed:** Darkened `.form-field` borders to `2px solid #4b5563` (`7.56:1` on white) and gave the `.mode-option` radio labels `1.5px solid #4b5563` borders with a `44px` minimum tap height.

### Finding 6: Missing `autocomplete` attributes on Name and Phone inputs

- **Cause:** Without input purpose attributes, browsers had to guess which contact details to suggest for autofill.
- **What I changed:** Added `autocomplete="name"` on `#name` and `autocomplete="tel"` on `#phone` in `index.html` so someone typing with one hand or motor tremors can fill both fields in two taps.

### Finding 7: No visual cue showing which fields were required before submitting

- **Cause:** Inputs had the HTML `required` attribute in code, but the visible labels looked optional until submission failed.
- **What I changed:** Added `(required)` directly inside every mandatory `<label>` (`Your Name (required)`, `Phone or WhatsApp (required)`, `What does your bike need? (required)`).

### Finding 8 (Recommendation): Body text fixed at `16px` ignored browser font-size settings

- **Cause:** `body` used hardcoded `16px` while buttons used `rem`, so changing Chrome's font-size setting to _Very large_ scaled buttons while body paragraphs stayed small.
- **What I changed:** Set `html { font-size: 100%; }` and switched `body`, headings, spacing variables, and controls to `rem` units so browser text-size preferences scale the whole page evenly up to `200%`.
