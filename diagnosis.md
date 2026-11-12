# Diagnosis of the Current Wheelhouse Website

Right now, the Wheelhouse website is getting in its own way. It was built for someone sitting comfortably at a desktop computer, when in reality, Kwame's actual customer is stranded on the side of the road in Kumasi staring at their phone.

The problem isn't just that the site looks dated, the underlying code makes it frustratingly difficult for people who need urgent help to actually reach out. Here is a breakdown of what is happening under the hood and how it is costing the shop business.

---

### 1. A Desktop-Only Build for a Mobile-First World

- **What’s happening in the code:** The HTML `<head>` is completely missing the `<meta name="viewport">` tag, which tells mobile browsers how to scale a page. On top of that, `styles.css` locks `#topnav`, `#headerbanner`, `#pagewrap`, and `#pagefooter` into a rigid `width: 960px`, and the service cards (`.service-box`) are held together using old-school, fixed-width floats (`float: left; width: 280px;`). Worse, the "Find Us" section hardcodes `float: left; width: 380px` and `width: 360px` directly inside inline HTML `style` attributes, making it impossible for CSS media queries to stack them on small screens.
- **Why it hurts the business:** When a stranded cyclist pulls up the site on their phone, their browser crams that wide 960px desktop view onto a tiny screen. The text shrinks down to an unreadable 2 or 3 pixels. Nobody dealing with a flat tyre or broken chain in the heat is going to pinch, zoom, and scroll sideways just to see if Wheelhouse can help them, they will just hit the "back" button and call the competitor down the road.

### 2. Buried Contact Info, Dead Nav Links & Unclickable Numbers

- **What’s happening in the code:** The page is laid out backwards for someone in a rush. Crucial details, like the phone number, workshop hours, and Adum location, are buried near the bottom of the DOM, beneath six service boxes, four FAQs, and the shop's 2019 backstory. Meanwhile, all five links in `#topnav` (`HOME`, `SERVICES`, `PRICING`, etc.) use dead `href="#"` attributes that don't actually scroll to those sections. Finally, the phone (`0322 000 000`) and WhatsApp (`0244 000 001`) numbers are written as plain, unlinked text instead of `tel:` and `https://wa.me/` links.
- **Why it hurts the business:** Picture a rider with grease on their hands trying to get ahold of Kwame. When they tap "CONTACT" in the menu, nothing happens. When they finally scroll to the bottom, they can't tap the number to call, they have to carefully highlight the text, copy it, switch to their phone dialer or WhatsApp, and paste it in. That is way too much friction at the exact moment a customer is trying to give Wheelhouse their business.

### 3. Generic "Div Soup" That Hurts Accessibility and Local Search

- **What’s happening in the code:** Instead of using descriptive HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<address>`, `<footer>`), the site is built entirely out of generic `<div>` blocks. It also skips heading levels (jumping from `<h1>` to `<h3>` in `#headerbanner`), uses `<b>` tags and double `<br><br>` line breaks for layout inside the service cards, and builds the FAQ section out of plain `<div>` tags (`.faq-trigger`) instead of keyboard-accessible `<details>` and `<summary>` elements. Body copy is also hardcoded at tiny `11px`–`13px` sizes with low-contrast `#555` grey text.
- **Why it hurts the business:** Tiny `12px` grey text is nearly impossible to read on a phone screen under bright outdoor sunlight. Furthermore, search engines rely on clean semantic headings and `<address>` tags to understand local businesses. When Googlebot crawls a wall of generic `<div>` and `<br>` tags, it hurts Wheelhouse's local SEO visibility whenever someone in Kumasi searches for _"bike repair near me."_

### 4. Broken Forms, Inline Style Overrides & an Unstyled Footer Section

- **What’s happening in the code:**
  1. **Two competing, broken forms:** The page has two separate forms ("Book a Service" and "Send Us a Message"). Both use `<input type="button">` instead of `<button type="submit">`. Even if `js/script.js` appends items to `#booking-list` in the browser, nothing is actually sent to Kwame.
  2. **Zero form accessibility or validation:** None of the inputs have `<label>` tags (relying only on `placeholder` text that vanishes when typing), none are marked `required`, and the phone and email fields use generic `type="text"` instead of `type="tel"` and `type="email"`.
  3. **Orphaned HTML & inline styles:** The entire `<div id="contact-section">` at the bottom was accidentally placed _outside_ of `#pagewrap` and has no matching CSS rules in `styles.css`, leaving it floating unaligned against the raw grey background. Meanwhile, random rainbow border colors (`#e74c3c`, `#3498db`, `#8e44ad`, etc.) are hardcoded inline on every `.service-box`.
- **Why it hurts the business:** Anyone who fills out the message form is sending their inquiry into a black hole, Kwame never receives the lead, and the customer assumes the shop is ignoring them. Visually, the rainbow service borders and the unstyled, broken form spilling out of the bottom of the layout make the website look unfinished and amateur, which directly undermines Kwame's goal of looking like a professional, trustworthy workshop.
