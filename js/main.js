/* =========================================================
   DYNAMEC ENGINEERING — small helper script
   1. Mobile menu open/close
   2. Current year in the footer
   3. "Send on WhatsApp" button on the contact form
   4. Animations (all skipped when the visitor asks for reduced motion):
      header line on scroll, blueprint drawing on the home page,
      words lighting up, client strip, section reveals,
      services sub-menu highlight
   ========================================================= */

// WhatsApp number used by the form button (country code 91, no + or spaces).
// Change this if the client says WhatsApp is on the other number.
var WHATSAPP_NUMBER = "919677383212";

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var canAnimate = !reduceMotion && "IntersectionObserver" in window;
document.documentElement.classList.add("js");
if (canAnimate) document.documentElement.classList.add("motion");

document.addEventListener("DOMContentLoaded", function () {

  // 1. Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) document.querySelector(".site-header").classList.remove("on-dark");
    };
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
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

  // 4a. Hairline under the header once the page is scrolled
  var header = document.querySelector(".site-header");
  var scrollJobs = [];
  var darkZone = document.querySelector(".story");
  if (header) scrollJobs.push(function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
    if (darkZone) {
      var r = darkZone.getBoundingClientRect();
      header.classList.toggle("on-dark", r.top <= 30 && r.bottom > 30 && !document.body.classList.contains("menu-open"));
    }
  });

  // 4b. Services page: highlight the sub-menu item for the group in view
  var subLinks = document.querySelectorAll(".subnav a");
  if (subLinks.length) {
    var groups = Array.prototype.map.call(subLinks, function (a) { return document.querySelector(a.getAttribute("href")); });
    scrollJobs.push(function () {
      var current = -1;
      groups.forEach(function (g, i) { if (g && g.getBoundingClientRect().top < window.innerHeight * 0.4) current = i; });
      subLinks.forEach(function (a, i) {
        var was = a.classList.contains("is-active");
        a.classList.toggle("is-active", i === current);
        // keep the active pill visible when the menu scrolls sideways on phones
        if (i === current && !was) {
          var bar = a.parentNode;
          bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    });
  }

  if (canAnimate) {
    // 4c. Home page: the blueprint draws itself and lights up one area per step
    var story = document.querySelector(".story");
    if (story) {
      var svg = story.querySelector("svg");
      var steps = story.querySelectorAll(".step");
      var bars = story.querySelectorAll(".story-progress span");
      svg.querySelectorAll(".part").forEach(function (el) { el.setAttribute("pathLength", "1"); });
      // Order in which the drawing appears, as fractions of the drawing phase
      var drawOrder = [["g-machine", 0, .45], ["g-fab", .3, .7], ["g-conveyor", .45, .85], ["g-coolant", .6, .95], ["g-spares", .7, 1]];
      var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
      var DRAW_END = 0.18; // first 18% of the section's scroll draws the machine

      scrollJobs.push(function () {
        var r = story.getBoundingClientRect();
        var p = clamp(-r.top / (r.height - window.innerHeight));
        var d = clamp(p / DRAW_END);
        drawOrder.forEach(function (o) {
          var local = clamp((d - o[1]) / (o[2] - o[1]));
          svg.querySelectorAll("." + o[0]).forEach(function (el) { el.style.setProperty("--off", 1 - local); });
        });
        svg.style.setProperty("--belt", d >= 1 ? 1 : 0);

        // Steps: 0 = intro, 1..4 = the four service areas
        var stepSize = (1 - DRAW_END) / 4;
        var n = p < DRAW_END ? 0 : Math.min(4, 1 + Math.floor((p - DRAW_END) / stepSize));
        if (story.getAttribute("data-step") !== String(n)) {
          story.setAttribute("data-step", n);
          steps.forEach(function (s, i) { s.classList.toggle("is-active", i === n); });
        }
        bars.forEach(function (b, i) {
          b.style.setProperty("--fill", clamp((p - DRAW_END - i * stepSize) / stepSize));
        });
      });
    }

    // 4d. Words of the statement light up as it scrolls through the screen
    document.querySelectorAll(".statement").forEach(function (el) {
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
      var words = el.querySelectorAll(".w");
      scrollJobs.push(function () {
        var r = el.getBoundingClientRect(), vh = window.innerHeight;
        var p = (vh * 0.85 - r.top) / (vh * 0.85 - vh * 0.3 + r.height * 0.5);
        var lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
        words.forEach(function (w, i) { w.classList.toggle("lit", i < lit); });
      });
    });

    // 4e. Endless client strip: duplicate each row once so it loops seamlessly
    document.querySelectorAll(".marquee-track").forEach(function (track) {
      Array.prototype.slice.call(track.children).forEach(function (el) {
        var copy = el.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      });
    });

    // 4f. Section headings fade up once as they come into view
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealer.observe(el); });
  }

  // Run all scroll work once per animation frame
  var ticking = false;
  var runJobs = function () { scrollJobs.forEach(function (job) { job(); }); ticking = false; };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(runJobs); } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  runJobs();
});
