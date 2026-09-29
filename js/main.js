/* =========================================================
   DYNAMEC ENGINEERING — small helper script
   1. Mobile menu open/close
   2. Current year in the footer
   3. "Send on WhatsApp" button on the contact form
   ========================================================= */

// WhatsApp number used by the form button (country code 91, no + or spaces).
// Change this if the client says WhatsApp is on the other number.
var WHATSAPP_NUMBER = "919677383212";

document.addEventListener("DOMContentLoaded", function () {

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
  }
});
