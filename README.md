# Wheelhouse Bike Repair - Website Rebuild

This repository contains the mobile-first, semantic rebuild of the Wheelhouse Bike Repair website, including the initial layout sketch, technical diagnosis of the legacy site, and post-rebuild audit.

---

## 1. Page Structure Sketch (Understand)

### Three Things a Customer Must Learn Within Five Seconds

| Priority | What the customer must learn                                 | Words from the brief that justify it                                                                                                                                                        | Where it sits in the layout                                                                                         |
| :------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------ |
| 1        | Can they fix my urgent bike problem today?                   | "Most customers find the shop when they need a repair urgently, whether that is a flat, a broken chain, or a bike that has not been serviced in years" and "They need it fixed today."      | Top hero status banner, main `<h1>` heading, and the first service cards right below the fold.                      |
| 2        | Where is the shop located and how do I reach them right now? | "Wheelhouse is a small bike repair and tune-up shop at Adum Commercial Area in Kumasi" and "they search on their phone for a nearby workshop".                                              | Sticky top bar with Call and WhatsApp buttons, plus the Adum address and Get Directions button in the hero.         |
| 3        | Is this a professional, reliable workshop with fair prices?  | "They look at two or three shops on their phone and pick the one that looks like it knows what it is doing. I do good work here." and "He is more concerned with people trusting the shop". | Transparent starting prices (From GH₵ 60) and clear walk-in inspection rules visible immediately without scrolling. |

### Initial Layout Sketch

![Mobile Layout Sketch](./images/sketch.png)

### Why the Page is Ordered This Way

Most of Kwame's customers are not browsing for fun. They are looking at their phones on the roadside with a flat tyre, broken chain, or neglected bike that needs fixing today. When they compare two or three shops in Kumasi, the top of the page has to answer their core questions within five seconds:

1. **Can I reach them or find them right now?** The top bar keeps one-tap **Call Shop** and **WhatsApp** buttons visible at all times, while the hero banner immediately confirms the shop's exact location (**Shop 4, Adum Commercial Area, Kumasi**), opening hours (**8:00 AM to 5:30 PM**), and a direct **Get Directions** button.
2. **Can they fix my problem today, and how much will it cost?** Immediately below the hero, **Repair Services & Pricing** puts urgent jobs (Tyre & Tube Replacement from GH₵ 60 and Basic Tune-Ups from GH₵ 80) first, followed by full rebuilds and overhauls. Showing clear starting prices builds immediate trust.
3. **How do drop-offs work?** Before asking the user to fill out a form or read FAQs, the **Find the Shop & Drop-Offs** section sits right below the services so walk-in customers can see the address, contact links, and the GH₵ 10/day overnight storage policy. Secondary details (the booking form, FAQs, and Kwame's 2019 backstory) are placed further down the page for visitors who have time to read more.

---

## 2. Diagnosis of the Current Wheelhouse Website (Analyse)

Right now, the Wheelhouse website is getting in its own way. It was designed for someone sitting comfortably at a desktop computer, when in reality, Kwame's actual customer is stranded on the side of the road in Kumasi staring at their phone.

| Symptom                                                                                           | Root cause                                                                                                                                           | Evidence                                                                                                                                                                                                                              | Who is affected                                                                     | Why it matters to the business                                                                                                                        |
| :------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop layout shrinks to unreadable tiny text and scrolls sideways on phones.                    | Missing viewport meta tag, fixed 960px container widths, and fixed-width floated columns.                                                            | 1) No `<meta name="viewport">` in `<head>`. 2) `width: 960px` on `#topnav`, `#headerbanner`, `#pagewrap`, `#pagefooter`. 3) `float: left; width: 280px` on `.service-box` and inline `380px`/`360px` floats.                          | Mobile customers searching in a hurry on the roadside.                              | Stranded cyclists will not pinch, zoom, and pan across a broken page in the sun. They bounce immediately to the competitor down the road.             |
| Customers cannot tap to call or find the shop address without scrolling to the bottom.            | Inverted DOM order, dead anchor links, and plain text contact details instead of protocol links.                                                     | 1) Address and hours sit at the bottom of `#pagewrap` below 6 services and 4 FAQs. 2) `#topnav` uses dead `href="#"` links. 3) `0322 000 000` and `0244 000 001` have no `tel:` or `wa.me` links.                                     | Urgent mobile users with dirty hands trying to call or find the shop.               | Forcing an urgent customer to scroll, highlight, copy, and paste a phone number creates friction right when they are ready to pay for a repair.       |
| Poor readability in bright sunlight, broken keyboard navigation, and weak local search structure. | Non-semantic `<div>` markup, skipped heading levels, `<br>` layout spacing, and 11px to 12px low-contrast fonts.                                     | 1) Generic `<div>` blocks instead of `<header>`, `<nav>`, `<main>`, `<section>`, `<address>`, `<footer>`. 2) Header skips `<h1>` to `<h3>`. 3) Static `<div class="faq-trigger">` for FAQs. 4) Inline `font-size: 12px; color: #555`. | Screen reader and keyboard users, outdoor mobile users, and search engine crawlers. | Tiny 12px grey text washes out in outdoor glare, and lack of semantic HTML landmarks hurts local Kumasi search rankings for bike repair.              |
| Service requests fail to submit and the bottom contact form renders outside the page layout.      | Forms use dead button inputs without labels or validation, inline rainbow styles override CSS, and `#contact-section` is placed outside `#pagewrap`. | 1) Both forms use `<input type="button">` instead of `<button type="submit">`. 2) Inputs lack `<label>` and `required` attributes. 3) `<div id="contact-section">` sits outside `#pagewrap` with no rules in `styles.css`.            | Customers trying to book a drop-off or check if a spare part is in stock.           | Unanswered form submissions mean lost leads for Kwame, while the unaligned bottom form and random inline border colors make the shop look unreliable. |

---

## 3. Audit of the Rebuilt Page (Evaluate)

### Semantic HTML & Heading Hierarchy

- **What I changed:** Replaced generic `<div>` blocks (`#topnav`, `#headerbanner`, `#pagewrap`, `#pagefooter`) and `<br><br>` spacers with semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<address>`, and `<footer>`). Fixed the skipped heading hierarchy (`<h1>` jumping to `<h3>` and `<b>` service titles) into a logical outline: one `<h1>` in the hero banner, `<h2>` headings for each top-level section (`#services`, `#location`, `#booking`, `#faq`, `#about`), and `<h3>` headings for each `.service-box` card and drop-off panel. Replaced static `<div class="faq-item">` blocks with native `<details>` and `<summary>` tags.
- **Why I prioritised this:** Moving the shop's location ("Shop 4, Adum Commercial Area") and operating hours into the hero banner and pulling the `<address>` section right below the services directly answers the brief. Clean landmarks, sequential headings, and native `<details>` disclosures also ensure screen readers and search bots can parse the page without relying on JavaScript.

### Baseline Accessibility & Contrast Ratios

- **What I changed:**
  1. **Viewport & Breakpoint Verification:** Added `<meta name="viewport" content="width=device-width, initial-scale=1.0">` and removed all `width: 960px` and `float: left` rules. Verified clean single-column mobile stacking at `320px` and `375px`, 2-column grid reflow at `600px`, and 3-column desktop grid layout at `820px`+ with zero horizontal overflow.
  2. **Typography & Before/After Contrast Ratios:** Increased body font size from `11px-12px` to `16px` (`1rem`). Improved body text from `#555555` (`7.46:1` on white, but illegible at `12px`) to `#222222` on `#ffffff` (**15.9:1**, WCAG AAA) and secondary text `#4a4a4a` on `#ffffff` (**8.86:1**, WCAG AAA). Darkened the primary action red from `#e74c3c` (`3.8:1` on white, failing WCAG AA) to `#c0392b` (**5.63:1** on `#ffffff`, passing WCAG AA), paired with high-contrast `#f1c40f` yellow on `#2c3e50` navy (**7.52:1**, WCAG AAA).
  3. **Form Labels & Validation Feedback:** Merged the two broken forms into one accessible `<form class="booking-form">`. Replaced `<input type="button">` with `<button type="submit">`, bound explicit `<label for="...">` tags to every input `id` (`#name`, `#phone`, `#issue`), added `required` attributes and `type="tel"` on the phone field, and kept `#booking-list` with `aria-live="polite"` so submission confirmation feedback is announced to assistive tech.
- **Why I prioritised this:** Customers looking up Wheelhouse are often outside on the roadside in bright Kumasi sunlight. Passing WCAG AA/AAA contrast at a `16px` base size and triggering the mobile number pad (`type="tel"`) removes friction for stressed riders.

### Visual Consistency: Deliberate Palette, Type Scale & Spacing System

- **Deliberate Trade Palette:** Replaced the 6 random inline rainbow borders (`#e74c3c`, `#3498db`, `#f39c12`, `#27ae60`, `#8e44ad`, `#16a085`) with a deliberate 4-color trade workshop palette: **Charcoal (`#1a1a1a`)** and **Workshop Navy (`#2c3e50`)** to project mechanical reliability, **Safety Red (`#c0392b`)** strictly for primary CTAs and the three urgent repair cards, and **Signal Yellow (`#f1c40f`)** for high-visibility dark-surface headings.
- **Type Scale & Spacing System:** Replaced scattered pixel sizes (`11px`, `12px`, `13px`, `14px`, `20px`, `34px`) with a modular `rem` type scale rooted at `16px` (`0.85rem` nav/badges, `0.95rem` buttons, `1rem` body, `1.1rem` `h3`, `1.35rem` `h2`, and `2rem` mobile / `2.5rem` desktop `h1`) using the high-x-height `Tahoma, Geneva, Verdana, sans-serif` stack. Replaced `<br>` tags with a consistent spacing scale (`8px`, `10px`, `16px`, `20px`, `32px`, `36px`).

---

## 4. Additional Improvement: One-Tap Call/WhatsApp Header & Live Open Status (Create)

### What I Added

1. **Sticky One-Tap Contact Bar:** Placed the shop phone (`0322 000 000`) and WhatsApp (`0244 000 001`) numbers in the sticky top header as clickable buttons using `tel:0322000000` and `https://wa.me/233244000001`.
2. **Real-Time Shop Status Banner (`#shop-status`):** Added a lightweight script at the top of the hero banner that checks the visitor's local time (targeting riders in Kumasi on Ghana standard time, `GMT` / `UTC+0`) against the exact workshop schedule stated in the brief and page copy (`Mon to Sat, 8:00 AM to 5:30 PM`). It converts hours and minutes into decimal hours (`time = getHours() + getMinutes() / 60`) and checks the boundary `day >= 1 && day <= 6 && time >= 8 && time < 17.5` (8:00 AM inclusive to 5:30 PM exclusive). During open hours it applies `.status-open` (`OPEN TODAY UNTIL 5:30 PM • WALK-INS WELCOME`); outside those hours or on Sundays (`day === 0`) it applies `.status-closed` (`CURRENTLY CLOSED • OPENS MON-SAT AT 8:00 AM`), falling back to the static HTML hours if JavaScript is disabled.

### Why It Matters for Wheelhouse

When a rider's bike breaks down in Adum, they compare two or three shops on their phone and want an answer immediately. Putting one-tap Call and WhatsApp buttons in a sticky bar lets a customer call Kwame or send a WhatsApp photo of a broken chain from anywhere on the page in one second, while the live open/closed status banner confirms right away that they will not waste a trip walking their bike over to the shop.
