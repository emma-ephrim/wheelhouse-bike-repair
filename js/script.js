// Wheelhouse Bike Repair - Modular UI scripts

(function () {
  "use strict";

  const TIMEZONE = "Africa/Accra";
  const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const WEEKDAY_INDEX = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  // Skip link sits above the header and jumps directly to #main-content,
  // so nudging scroll on its focus would fight its anchor jump.
  const SKIP_LINK_CLASS = "skip-link";
  const HEADER_CLEARANCE_PX = 16;
  const MAX_PREVIEW_CHARS = {
    kind: 40,
    name: 60,
    phone: 30,
    issue: 140,
  };

  function parseHourAttr(rawValue) {
    const trimmed = (rawValue ?? "").trim();
    if (trimmed === "") return NaN;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 24
      ? parsed
      : NaN;
  }

  function parseDaysAttr(rawValue) {
    const trimmed = (rawValue ?? "").trim();
    if (trimmed === "") return [];
    return trimmed
      .split(",")
      .map(function (token) {
        const day = Number(token.trim());
        return Number.isInteger(day) && day >= 0 && day <= 6 ? day : NaN;
      })
      .filter(function (day) {
        return !Number.isNaN(day);
      });
  }

  // Converts Intl.DateTimeFormat 24-hour parts into fractional hours (e.g. 17:30 -> 17.5)
  function toDecimalHours(partMap) {
    const hour = Number(partMap.hour ?? NaN);
    const minute = Number(partMap.minute ?? NaN);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return NaN;
    return (hour % 24) + minute / 60;
  }

  function formatTime12h(decimalHour) {
    const totalMinutes = Math.round(decimalHour * 60);
    const hours24 = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return hours12 + ":" + String(minutes).padStart(2, "0") + " " + period;
  }

  function formatDayRange(days) {
    const sorted = Array.from(new Set(days)).sort(function (a, b) {
      return a - b;
    });
    if (sorted.length === 0) return "";
    const isContiguous =
      sorted.length > 2 &&
      sorted[sorted.length - 1] - sorted[0] === sorted.length - 1;
    if (isContiguous) {
      return DAY_ABBR[sorted[0]] + "-" + DAY_ABBR[sorted[sorted.length - 1]];
    }
    return sorted
      .map(function (d) {
        return DAY_ABBR[d];
      })
      .join(", ");
  }

  function sanitizePreview(rawValue, maxLength) {
    const normalized = (rawValue ?? "").trim().replace(/\s+/g, " ");
    if (normalized.length <= maxLength) return normalized;
    return normalized.slice(0, maxLength - 1).trimEnd() + "…";
  }

  function buildFeedbackBanner(options) {
    const box = document.createElement("div");
    box.className = options.isError
      ? "form-feedback is-error"
      : "form-feedback";
    if (options.isError) {
      box.setAttribute("role", "alert");
    }

    const title = document.createElement("strong");
    title.textContent = options.titleText;

    const detail = document.createElement("span");
    detail.textContent = options.detailText;

    box.appendChild(title);
    box.appendChild(detail);
    return box;
  }

  function initMenu(siteHeader) {
    const menuBtn = document.getElementById("menu-toggle");
    const primaryMenu = document.getElementById("primary-menu");
    if (!menuBtn || !primaryMenu) return;

    const iconSpan = menuBtn.querySelector(".menu-icon");
    if (iconSpan) {
      iconSpan.setAttribute("aria-hidden", "true");
    }

    function setMenuState(isOpen, returnFocus) {
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      primaryMenu.classList.toggle("is-open", isOpen);
      if (iconSpan) {
        iconSpan.textContent = isOpen ? "✕" : "☰";
      }
      if (!isOpen && returnFocus) {
        menuBtn.focus();
      }
    }

    setMenuState(false, false);

    menuBtn.addEventListener("click", function () {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen, false);
    });

    primaryMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false, false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && primaryMenu.classList.contains("is-open")) {
        setMenuState(false, true);
      }
    });

    if (siteHeader) {
      siteHeader.addEventListener("focusout", function (e) {
        if (
          primaryMenu.classList.contains("is-open") &&
          e.relatedTarget instanceof Node &&
          !siteHeader.contains(e.relatedTarget)
        ) {
          setMenuState(false, false);
        }
      });
    }
  }

  function initShopStatus() {
    const statusEl = document.getElementById("shop-status");
    if (!statusEl) return;

    const openHour = parseHourAttr(statusEl.dataset.open);
    const closeHour = parseHourAttr(statusEl.dataset.close);
    const openDays = parseDaysAttr(statusEl.dataset.days);

    if (
      Number.isNaN(openHour) ||
      Number.isNaN(closeHour) ||
      openDays.length === 0
    ) {
      return;
    }

    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: TIMEZONE,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());

    const partMap = Object.fromEntries(
      parts.map(function (p) {
        return [p.type, p.value];
      }),
    );
    const dayIndex = WEEKDAY_INDEX[partMap.weekday];
    const currentHours = toDecimalHours(partMap);

    if (dayIndex === undefined || Number.isNaN(currentHours)) return;

    const isOpen =
      openDays.includes(dayIndex) &&
      currentHours >= openHour &&
      currentHours < closeHour;

    if (!statusEl.hasAttribute("aria-live")) {
      statusEl.setAttribute("aria-live", "polite");
    }

    statusEl.classList.remove("status-open", "status-closed");
    if (isOpen) {
      statusEl.textContent =
        "● OPEN NOW UNTIL " + formatTime12h(closeHour) + " • WALK-INS WELCOME";
      statusEl.classList.add("status-open");
    } else {
      statusEl.textContent =
        "✕ CLOSED NOW • OPENS " +
        formatDayRange(openDays) +
        " AT " +
        formatTime12h(openHour);
      statusEl.classList.add("status-closed");
    }
  }

  function initFormMode(form) {
    if (!form) return function () {};

    const radios = form.querySelectorAll('input[name="request_type"]');
    const issuePrompt = document.getElementById("issue-prompt");
    const issueInput = document.getElementById("issue");

    if (radios.length === 0 || !issuePrompt || !issueInput) {
      return function () {};
    }

    function syncFormMode() {
      radios.forEach(function (radio) {
        const optionLabel = radio.closest(".mode-option");
        if (optionLabel) {
          optionLabel.classList.toggle("is-selected", radio.checked);
        }
      });

      const checked = form.querySelector('input[name="request_type"]:checked');
      if (!checked) return;

      if (checked.dataset.prompt) {
        issuePrompt.textContent = checked.dataset.prompt;
      }
      if (checked.dataset.placeholder) {
        issueInput.placeholder = checked.dataset.placeholder;
      }
    }

    radios.forEach(function (radio) {
      radio.addEventListener("change", syncFormMode);
    });

    syncFormMode();
    return syncFormMode;
  }

  function initBookingForm() {
    const form = document.querySelector(".booking-form");
    const output = document.getElementById("booking-list");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const issueInput = document.getElementById("issue");

    if (!form || !output || !nameInput || !phoneInput || !issueInput) return;

    const syncFormMode = initFormMode(form);

    const requiredFields = [
      { el: nameInput, label: "Your Name" },
      { el: phoneInput, label: "Phone or WhatsApp" },
      { el: issueInput, label: "Bike details or question" },
    ];

    requiredFields.forEach(function (field) {
      field.el.addEventListener("input", function () {
        if (field.el.value.trim() !== "") {
          field.el.removeAttribute("aria-invalid");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const missingLabels = [];
      let firstInvalid = null;

      requiredFields.forEach(function (field) {
        if (field.el.value.trim() === "") {
          field.el.setAttribute("aria-invalid", "true");
          missingLabels.push(field.label);
          if (!firstInvalid) firstInvalid = field.el;
        } else {
          field.el.removeAttribute("aria-invalid");
        }
      });

      if (missingLabels.length > 0) {
        const errorBanner = buildFeedbackBanner({
          isError: true,
          titleText: "Please complete required fields: ",
          detailText: missingLabels.join(", ") + ".",
        });
        output.replaceChildren(errorBanner);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const checked = form.querySelector('input[name="request_type"]:checked');
      const safeKind = sanitizePreview(
        checked ? checked.value : "Request",
        MAX_PREVIEW_CHARS.kind,
      );
      const safeName = sanitizePreview(nameInput.value, MAX_PREVIEW_CHARS.name);
      const safePhone = sanitizePreview(
        phoneInput.value,
        MAX_PREVIEW_CHARS.phone,
      );
      const safeIssue = sanitizePreview(
        issueInput.value,
        MAX_PREVIEW_CHARS.issue,
      );

      const successBanner = buildFeedbackBanner({
        isError: false,
        titleText: safeKind + " received from " + safeName + ": ",
        detailText:
          '"' +
          safeIssue +
          '" - Kwame will call or WhatsApp ' +
          safePhone +
          " shortly.",
      });

      output.replaceChildren(successBanner);
      form.reset();
      syncFormMode();
    });
  }

  function initStickyFocusGuard(siteHeader) {
    const mainContent = document.getElementById("main-content");
    if (!siteHeader || !mainContent) return;

    // Gate listener registration once at init if header is not sticky
    if (window.getComputedStyle(siteHeader).position !== "sticky") return;

    mainContent.addEventListener("focusin", function (e) {
      const target = e.target;
      if (
        !(target instanceof HTMLElement) ||
        target.classList.contains(SKIP_LINK_CLASS)
      ) {
        return;
      }

      if (window.getComputedStyle(siteHeader).position !== "sticky") return;

      const headerBottom = siteHeader.getBoundingClientRect().bottom;
      const targetTop = target.getBoundingClientRect().top;

      if (targetTop < headerBottom + HEADER_CLEARANCE_PX) {
        window.scrollBy({
          top: targetTop - headerBottom - HEADER_CLEARANCE_PX,
          behavior: "instant",
        });
      }
    });
  }

  document.documentElement.classList.add("js-enabled");
  const siteHeader = document.querySelector(".site-header");
  initMenu(siteHeader);
  initShopStatus();
  initBookingForm();
  initStickyFocusGuard(siteHeader);
})();
