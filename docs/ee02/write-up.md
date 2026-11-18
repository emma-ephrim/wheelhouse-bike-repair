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

## 2. Further Accessibility & Situational Improvements Beyond the Audit

Looking past the audit checklist to the real-world conditions in Adum, Kumasi, a stranded rider faces three compounding situational barriers that automated tools and indoor desktop tests overlook: **harsh midday sunlight glare**, **one-handed phone operation while holding a broken bicycle** (or uncertain technical vocabulary when describing a broken part), and **congested mobile data connections**.

### What I Built to Remove Those Barriers

1. **One-Tap Pre-Filled WhatsApp Photo Triage Banner + Dual-Mode Inquiry Form:** A rider with one free hand or unfamiliar with bicycle part names (such as derailleur hangers or tyre ETRTO markings) struggles to type detailed descriptions into a form. Directly below the hero, a warm high-contrast callout offers a pre-filled WhatsApp link (`Send Photo on WhatsApp`) so the rider can snap a picture of their tyre sidewall or broken chain in seconds. Down in `#booking`, a `<fieldset>`/`<legend>` radio switch (`Book a Repair Drop-Off` vs. `Ask a Question / Check Parts`) dynamically updates `#issue-label` and placeholder examples so general inquiries never feel forced into a repair booking flow.
2. **Sunlight-Grade AAA Text Contrast & Non-Color GMT Shop Status (`WCAG 1.4.1` & Timezone Accuracy):** Upgraded body copy to `#111827` (**17.7:1**) and muted copy to `#374151` (**10.3:1** on white, **9.4:1** on `#f4f5f7`), paired with a solid dark fill and `2px solid #ffffff` border on the secondary hero CTA so nothing washes out outdoors. Rewrote the `#shop-status` script using `Intl.DateTimeFormat` locked to `Africa/Accra` (`GMT`) so visitors always see accurate Kumasi workshop hours regardless of device clock settings, and prepended non-color symbols (`● OPEN NOW` vs. `✕ CLOSED NOW`) so color-blind users do not rely on green/red top borders alone.
3. **Low-Bandwidth Image Compression:** Compressed the hero workshop photograph (`images/workshop-hero.jpg`) with explicit `width`/`height` attributes (preventing layout shift) and `fetchpriority="high"` so mobile riders on slow connections see a real, trustworthy Kumasi workshop immediately without multi-megabyte data cost.

---

## 3. Re-Verification Summary

After applying all changes, I re-tested the full single-page journey:

- **Keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`):** Verified from the `Skip to main content` link through the header, mobile menu (`Escape` and `focusout` dismissal), `<details>` FAQs, and backwards `Shift+Tab` into the Submit button—every focused control stays completely clear of `.site-header` and displays a `>=3:1` focus indicator.
- **Zoom & Text Resize (`200%` text size, `400%` zoom at `1280px`, and `320px` mobile width):** Header unsticks automatically at `400%` zoom, buttons stay on one line, all text scales cleanly via `rem`, and zero horizontal scrollbar appears anywhere on the page.
- **Form & Screen Reader Checks:** Verified empty-submit error recovery (`aria-invalid="true"` + focus moved to first missing input + `role="alert"` announcement) and successful repair/question confirmation inside `aria-live="polite"`.
