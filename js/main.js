/* =========================================================
   DYNAMEC ENGINEERING — small helper script
   1. Mobile menu open/close
   2. Current year in the footer
   3. "Send on WhatsApp" button on the contact form
   4. Animations: header on scroll, scroll reveal, counting stats,
      card spotlight, endless client strip
   ========================================================= */

// WhatsApp number used by the form button (country code 91, no + or spaces).
// Change this if the client says WhatsApp is on the other number.
var WHATSAPP_NUMBER = "919677383212";

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // 2. Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 3. WhatsApp enquiry button
  var waBtn = document.getElementById("wa-send");
  var form = document.getElementById("enquiry-form");
  if (waBtn && form) {
    waBtn.addEventListener("click", function () {
      // Use the browser's built-in check for required fields first
      if (!form.reportValidity()) return;

      var get = function (name) {
        var el = form.elements[name];
        return el && el.value ? el.value.trim() : "";
      };

      var lines = [
        "Hello Dynamec Engineering, I have an enquiry.",
        "",
        "Name: " + get("name"),
        get("company") ? "Company: " + get("company") : "",
        "Phone: " + get("phone"),
        get("email") ? "Email: " + get("email") : "",
        get("service") ? "Service: " + get("service") : "",
        "",
        get("message")
      ].filter(function (line, i, arr) {
        // drop empty optional lines, keep intentional blank spacer lines
        return line !== "" || (i > 0 && arr[i - 1] !== "");
      });

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });

    // Netlify Forms only works when hosted on Netlify (netlify.app or the real
    // domain). On the GitHub Pages preview or a file opened from disk,
    // "Send Enquiry" sends via WhatsApp instead.
    if (/github\.io$/.test(location.hostname) || location.protocol === "file:") {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        waBtn.click();
      });
    }
  }

  // 4a. Header gets a shadow once the page is scrolled
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 10); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // 4b. Endless client strip on the home page: duplicate the list once
  var marquee = document.querySelector(".client-marquee .client-grid");
  if (marquee && !reduceMotion) {
    Array.prototype.slice.call(marquee.children).forEach(function (el) {
      var copy = el.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      marquee.appendChild(copy);
    });
  }

  // 4c. Card spotlight follows the cursor
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) return;

  // 4d. Fade content in as it scrolls into view; siblings follow one after another
  var targets = document.querySelectorAll(
    ".section-head, .card, .why-item, .section:not(.client-marquee-section) .client, .fact-panel, .quote-box, " +
    ".split > div, .info-list li, .form-card, .map-wrap, .group-title, .service-group > p, " +
    ".industry-tags span, .stat, .cta-inner, .client-marquee"
  );
  targets.forEach(function (el) {
    if (el.closest(".client-marquee") && !el.classList.contains("client-marquee")) return;
    var index = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--d", Math.min(index, 8) * 0.07 + "s");
    el.classList.add("reveal");
  });
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealer.observe(el); });

  // 4e. Stats count up from zero when they appear
  var counter = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      counter.unobserve(entry.target);
      var el = entry.target;
      var match = el.textContent.match(/^(\d+)(.*)$/);
      if (!match) return;
      var end = parseInt(match[1], 10), suffix = match[2], start = null, duration = 1600;
      var step = function (t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".stat strong").forEach(function (el) { counter.observe(el); });
});
