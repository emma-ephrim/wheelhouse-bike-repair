# EE02 Accessibility Write-Up: Wheelhouse Bike Repair

- **Live site:** https://emma-ephrim.github.io/wheelhouse-bike-repair/
- **Audit received from:** Calvin Nunana Quashie (`16 November 2026`, tested against WCAG 2.2 Level AA)

---

## 1. Fixes Made From the Peer Audit

Calvin's manual keyboard, zoom, Safari/macOS, iPhone one-thumb, and screen-reader (Narrator and VoiceOver) audit surfaced eight findings that automated WAVE and Lighthouse checks missed. Every finding has been resolved in the codebase:

### Finding 1: Submitting the form showed a blank "405 Not Allowed" error

- **Cause:** `<form>` used `method="post" action="#booking"` on static GitHub Pages hosting with no JavaScript `submit` handler, wiping out the user's one-handed input.
- **What I changed:** Removed `method="post"` from `<form class="card booking-form" action="#booking" novalidate>` in `index.html` and implemented a client-side `submit` handler in `js/script.js`.
- **How it works now:** Submitting valid details prevents page reload, announces a clear confirmation message inside `<div id="booking-list" aria-live="polite">` specifying whether a **Repair Booking** or **General Question / Part Check** was received, and resets the form cleanly. If required fields are blank, `js/script.js` sets `aria-invalid="true"` on each missing field, lists the missing field names inside a `role="alert"` banner, and moves focus directly to the first invalid input (`WCAG 3.3.1`, `3.3.3`, `4.1.2`).

### Finding 2: `Shift+Tab` hid the focused Submit button behind the sticky header (`WCAG 2.4.11 Focus Not Obscured`)

- **Cause:** `.site-header` used `position: sticky; top: 0` without `scroll-padding-top` or `scroll-margin-top`, so tabbing backwards from `#faq` into `#booking` left the focused submit button tucked behind the header bar.
- **What I changed:** Added `scroll-padding-top: 8.5rem` (`6.5rem` on wide desktop) on `html` and `scroll-margin-top` on `section[id], a, button, input, textarea, summary` in `css/styles.css`, plus a `focusin` guard in `js/script.js` that checks `siteHeader.getBoundingClientRect().bottom` against the focused element's top edge and scrolls it clear whenever focus lands behind the sticky bar. Also added an auto-close `focusout` listener on `.site-header` so the mobile menu collapses when keyboard focus tabs past the navigation links.

### Finding 3: Near-invisible `1.77:1` default focus ring on the dark header in Safari (`WCAG 2.4.7` & `1.4.11`)

- **Cause:** Relying on browser default focus styles caused macOS Safari to draw a `#164188` blue ring against the dark header (`1.77:1`) and green WhatsApp button (`2.1:1`), failing the `3:1` non-text contrast requirement.
- **What I changed:** Added explicit `:focus-visible` rules across `css/styles.css`: a `3px solid #c2410c` (`--orange-700`, **5.18:1** on white) ring with `3px` offset on light sections, and a `3px solid #facc15` (`--focus-gold`) ring on `.site-header`, `.hero`, `.location-card`, and `#pagefooter` (**12.85:1** contrast against `#121316`). Added a visible-on-focus `<a href="#main-content" class="skip-link">Skip to main content</a>` as the first interactive element in `<body>` (`WCAG 2.4.1`).

### Finding 4: At `400%` zoom the sticky header covered half the viewport and the menu scrolled sideways (`WCAG 1.4.10 Reflow`)

- **Cause:** `.nav-links` previously used `overflow-x: auto` (forcing `483px` of links into a `320px` viewport and hiding `FAQ` and `About` off-screen), while `.site-header` stayed `position: sticky` inside a `320×256` zoomed viewport (`126px` out of `256px` vertical space).
- **What I changed:**
  1. Replaced the sideways-scrolling nav strip with an accessible mobile menu toggle (`<button id="menu-toggle" aria-expanded="false" aria-controls="primary-menu">`) that collapses cleanly on screens below `768px`, supports `Escape` key dismissal (returning focus to `#menu-toggle`), and stays visible if JavaScript fails to load.
  2. Added `@media (max-height: 520px), (max-width: 360px)` at the bottom of `css/styles.css` to set `.site-header { position: static; }`, ensuring `100%` of the viewport scrolls freely at `400%` zoom with zero horizontal overflow (`overflow-x: clip` and `white-space: nowrap` single-line header buttons).

### Finding 5: Faint `2.84:1` form input borders (`WCAG 1.4.11 Non-text Contrast`)

- **Cause:** `#999999` borders on `#ffffff` measured `2.84:1`, below the `3:1` minimum for form control boundaries and hard to spot in Kumasi daylight.
- **What I changed:** Updated `.form-field` to `border: 2px solid #4b5563` (`--border-control`) on `#ffffff`, achieving **7.56:1** contrast (more than double the `3:1` AA minimum), and styled `.mode-option` radio cards with `1.5px solid #4b5563` borders and `44px` minimum height (`WCAG 2.5.8`).

### Finding 6: Missing `autocomplete` attributes on Name and Phone inputs (`WCAG 1.3.5 Identify Input Purpose`)

- **Cause:** Browsers had to guess contact autofill because programmatic input purpose attributes were missing.
- **What I changed:** Added `autocomplete="name"` on `#name` and `autocomplete="tel"` on `#phone` in `index.html` so one-handed riders and users with motor tremors can autofill contact details in two taps across all browsers.

### Finding 7: No visible indication of required fields before submitting (`WCAG 3.3.2 Labels or Instructions`)

- **Cause:** Fields had the HTML `required` attribute, but labels gave no visual cue until submission failed.
- **What I changed:** Added explicit `(required)` text directly inside every mandatory `<label>` (`Your Name (required)`, `Phone or WhatsApp (required)`, `What does your bike need? (required)`).

### Finding 8 (Recommendation): Body text fixed at `16px` did not scale with browser font-size settings (`WCAG 1.4.4 Resize Text`)

- **Cause:** `body` used hardcoded `16px` while buttons used `rem`, creating uneven scaling under Chrome's _Very large_ font setting.
- **What I changed:** Set `html { font-size: 100%; }` and converted `body`, headings, spacing tokens, and component typography to `rem` units so user font-size preferences scale the entire interface proportionally up to `200%` without clipping.

---

## 2. Additional Improvement Beyond the Audit: Quick WhatsApp Photo Check & Two-Option Form

### Who the Audit Missed

Calvin tested keyboard use, zoom, screen readers, and one-handed typing for someone who already knows what repair to ask for. In real life, many everyday riders in Kumasi do not know the names of specific bike parts, struggle with spelling (such as people with dyslexia or riders more comfortable speaking Twi than typing English), or just want to check if a tube size is in stock before walking over. Calvin also noted that he did not test slow mobile data or Kumasi's local timezone. Even with a working form, forcing someone on the roadside to type out a full description of a broken part can make them give up and try another shop.

### What I Added and Why It Helps

1. **One-Tap WhatsApp Photo Strip (`index.html`):** Right below the hero banner, I added a clear notice (`Stranded or unsure which part your bike needs?`) with a `Send Photo on WhatsApp` button that opens WhatsApp with a starter message already filled in. Instead of struggling to explain a bent gear part or read tiny numbers on a flat tyre, a rider can just snap a photo and let Kwame confirm the part and price in seconds.
2. **Repair vs. Question Switch in the Form (`index.html` & `js/script.js`):** Inside the form, I added two radio buttons grouped in a `<fieldset>`: `Book a Repair Drop-Off` and `Ask a Question / Check Parts`. Picking the second option changes the text box label and example hint right away, so someone with a quick question knows the form is for them too.
3. **Clear Open/Closed Signs, Sunlight Contrast, and Smaller Image Size:** I set the open/closed banner (`#shop-status`) to check Ghana time (`Africa/Accra`) instead of the visitor's phone clock, and added `●` and `✕` symbols (`● OPEN NOW` vs. `✕ CLOSED NOW`) so colour-blind visitors do not have to rely on green and red borders alone. I also darkened the grey text for bright outdoor sunlight and compressed the hero workshop photo so it loads quickly on slow mobile data.

---

## 3. Re-Verification Summary

After making these fixes, I tested the whole page again by hand:

- **Keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`):** Tabbed from `Skip to main content` through the header, mobile menu (`Escape` and tabbing out both close it), FAQ items, and backwards with `Shift+Tab` onto the Submit button. Nothing gets hidden behind the sticky header, and every link, button, and input shows a clear focus ring.
- **Zoom & Text Size (`200%` text size, `400%` zoom, and `320px` phone width):** At `400%` zoom, the top header stops sticking to the screen so it no longer blocks half the view, buttons stay on a single line, all text grows evenly, and there is no sideways scrolling.
- **Form & Screen Reader Checks:** Leaving fields blank marks the empty boxes as invalid, announces what is missing, and moves the cursor straight to the first empty box. Sending a filled form shows a clear confirmation message right below the button without reloading the page.
