// Wheelhouse Bike Repair — Accessible Mobile Nav, GMT Status & Dual-Purpose Form

(function () {
  // 1. Accessible Mobile Menu Toggle (Progressive Enhancement + Escape Key Support)
  document.documentElement.classList.add("js-enabled");
  const menuBtn = document.getElementById("menu-toggle");
  const primaryMenu = document.getElementById("primary-menu");

  if (menuBtn && primaryMenu) {
    const iconSpan = menuBtn.querySelector(".menu-icon");

    function closeMenu(returnFocus) {
      menuBtn.setAttribute("aria-expanded", "false");
      primaryMenu.classList.remove("is-open");
      if (iconSpan) iconSpan.textContent = "☰";
      if (returnFocus) menuBtn.focus();
    }

    menuBtn.addEventListener("click", function () {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu(false);
      } else {
        menuBtn.setAttribute("aria-expanded", "true");
        primaryMenu.classList.add("is-open");
        if (iconSpan) iconSpan.textContent = "✕";
      }
    });

    // Close mobile menu after selecting a section link
    primaryMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    // Dismiss open mobile menu with Escape key and return focus to toggle button
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && primaryMenu.classList.contains("is-open")) {
        closeMenu(true);
      }
    });
  }

  // 2. Live Kumasi (Africa/Accra, GMT) Workshop Status
  const statusEl = document.getElementById("shop-status");
  if (statusEl) {
    const openHour = parseFloat(statusEl.dataset.open || "8");
    const closeHour = parseFloat(statusEl.dataset.close || "17.5");
    const openDays = (statusEl.dataset.days || "1,2,3,4,5,6")
      .split(",")
      .map(Number);

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Accra",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());

    const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    const dayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[
      map.weekday
    ];
    const decimalTime = parseInt(map.hour, 10) + parseInt(map.minute, 10) / 60;

    const isOpen =
      openDays.includes(dayIndex) &&
      decimalTime >= openHour &&
      decimalTime < closeHour;

    statusEl.classList.remove("status-open", "status-closed");
    if (isOpen) {
      statusEl.textContent = "OPEN NOW UNTIL 5:30 PM • WALK-INS WELCOME";
      statusEl.classList.add("status-open");
    } else {
      statusEl.textContent = "CLOSED NOW • OPENS MON–SAT AT 8:00 AM";
      statusEl.classList.add("status-closed");
    }
  }

  // 3. Dual-Purpose Form Toggle (Repair Booking vs. Quick Question)
  const radios = document.querySelectorAll('input[name="request_type"]');
  const issueLabel = document.getElementById("issue-label");
  const issueInput = document.getElementById("issue");

  function syncFormMode() {
    const checked = document.querySelector(
      'input[name="request_type"]:checked',
    );
    if (!checked || !issueLabel || !issueInput) return;

    if (checked.id === "mode-question") {
      issueLabel.textContent = "Your Question or Part Needed (required)";
      issueInput.placeholder =
        "e.g. Do you have 26-inch inner tubes or bike locks in stock?";
    } else {
      issueLabel.textContent = "What does your bike need? (required)";
      issueInput.placeholder =
        "e.g. Flat rear tyre, snapped chain, or gears slipping";
    }
  }

  radios.forEach((r) => r.addEventListener("change", syncFormMode));

  // 4. Accessible Form Validation & Confirmation
  const form = document.querySelector(".booking-form");
  const output = document.getElementById("booking-list");

  if (form && output) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const details = issueInput.value.trim();
      const checked = document.querySelector(
        'input[name="request_type"]:checked',
      );
      const kind = checked ? checked.value : "Request";

      if (!name || !phone || !details) {
        output.innerHTML =
          '<div class="form-feedback is-error" role="alert">' +
          "<strong>Missing details:</strong> Please enter your name, phone or WhatsApp number, and message so Kwame can reply." +
          "</div>";
        return;
      }

      const box = document.createElement("div");
      box.className = "form-feedback";
      const title = document.createElement("strong");
      title.textContent = kind + " received from " + name + ": ";
      const msg = document.createElement("span");
      msg.textContent =
        '"' +
        details +
        '" — Kwame will call or WhatsApp ' +
        phone +
        " shortly.";

      box.appendChild(title);
      box.appendChild(msg);
      output.innerHTML = "";
      output.appendChild(box);
      form.reset();
      syncFormMode();
    });
  }
})();
