// Wheelhouse Bike Repair - Main UI scripts

(function () {
  // Mobile menu toggle
  document.documentElement.classList.add("js-enabled");
  const siteHeader = document.querySelector(".site-header");
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

    // Close menu when a link is clicked
    primaryMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    // Let Escape close the menu and put focus back on the toggle button
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && primaryMenu.classList.contains("is-open")) {
        closeMenu(true);
      }
    });

    // Close menu if the user tabs past the header
    if (siteHeader) {
      siteHeader.addEventListener("focusout", function (e) {
        if (
          primaryMenu.classList.contains("is-open") &&
          e.relatedTarget &&
          !siteHeader.contains(e.relatedTarget)
        ) {
          closeMenu(false);
        }
      });
    }
  }

  // Shop open/closed banner using Ghana time (Africa/Accra)
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
      statusEl.textContent = "● OPEN NOW UNTIL 5:30 PM • WALK-INS WELCOME";
      statusEl.classList.add("status-open");
    } else {
      statusEl.textContent = "✕ CLOSED NOW • OPENS MON-SAT AT 8:00 AM";
      statusEl.classList.add("status-closed");
    }
  }

  // Update textarea label and placeholder when switching between booking and question
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

  // Form validation and confirmation message
  const form = document.querySelector(".booking-form");
  const output = document.getElementById("booking-list");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");

  if (form && output && nameInput && phoneInput && issueInput) {
    const requiredFields = [
      { el: nameInput, label: "Your Name" },
      { el: phoneInput, label: "Phone or WhatsApp" },
      { el: issueInput, label: "Bike details or question" },
    ];

    requiredFields.forEach(function (item) {
      item.el.addEventListener("input", function () {
        if (item.el.value.trim()) {
          item.el.removeAttribute("aria-invalid");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const missingLabels = [];
      let firstInvalid = null;

      requiredFields.forEach(function (item) {
        if (!item.el.value.trim()) {
          item.el.setAttribute("aria-invalid", "true");
          missingLabels.push(item.label);
          if (!firstInvalid) firstInvalid = item.el;
        } else {
          item.el.removeAttribute("aria-invalid");
        }
      });

      if (missingLabels.length > 0) {
        output.innerHTML =
          '<div class="form-feedback is-error" role="alert">' +
          "<strong>Please complete required fields:</strong> " +
          missingLabels.join(", ") +
          "." +
          "</div>";
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const checked = document.querySelector(
        'input[name="request_type"]:checked',
      );
      const kind = checked ? checked.value : "Request";

      const box = document.createElement("div");
      box.className = "form-feedback";
      const title = document.createElement("strong");
      title.textContent =
        kind + " received from " + nameInput.value.trim() + ": ";
      const msg = document.createElement("span");
      msg.textContent =
        '"' +
        issueInput.value.trim() +
        '" - Kwame will call or WhatsApp ' +
        phoneInput.value.trim() +
        " shortly.";

      box.appendChild(title);
      box.appendChild(msg);
      output.innerHTML = "";
      output.appendChild(box);
      form.reset();
      syncFormMode();
    });
  }

  // Nudge the page if Shift+Tab lands an element behind the sticky header
  document.addEventListener("focusin", function (e) {
    if (!siteHeader || !e.target || e.target.classList.contains("skip-link")) {
      return;
    }
    if (siteHeader.contains(e.target)) return;

    const headerStyle = window.getComputedStyle(siteHeader);
    if (headerStyle.position !== "sticky") return;

    const headerBottom = siteHeader.getBoundingClientRect().bottom;
    const targetTop = e.target.getBoundingClientRect().top;

    if (targetTop < headerBottom + 12) {
      window.scrollBy({
        top: targetTop - headerBottom - 16,
        behavior: "instant",
      });
    }
  });
})();
