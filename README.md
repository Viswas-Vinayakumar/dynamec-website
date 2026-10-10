# Dynamec Engineering – Website (Version 1)

Plain HTML + CSS + a little JavaScript. No framework, no database, no build step.
Open any `.html` file in a text editor (VS Code is best), change it, save, upload again.

## Files

```
index.html        Home page
about.html        About Us
services.html     All 10 services, in 4 groups
clients.html      Customer list + industries
contact.html      Contact details, map, enquiry form
thank-you.html    Shown after the form is sent
404.html          Shown for wrong links
css/style.css     All design (colours at the top, in :root)
js/main.js        Mobile menu, footer year, "Send on WhatsApp" button, animations
images/           Logo and favicon (add photos here in v2)
robots.txt, sitemap.xml   For Google
```

The header and footer are copied into every page. If you change a phone number,
change it in all pages: in VS Code use **Edit > Replace in Files** (Ctrl+Shift+H).

## See it on your computer

Double-click `index.html`, or run a small local server (better, because links behave like the real site):

```
cd dynamec-website
python3 -m http.server 8000
```

Then open http://localhost:8000. The enquiry form only really submits after it is on Netlify.

## Put it online (Netlify, free)

**Fastest way (no account setup needed beyond login):**
1. Go to https://app.netlify.com/drop
2. Drag the whole `dynamec-website` folder onto the page.
3. You get a live link like `something.netlify.app`. Rename it in Site settings (e.g. `dynamec-engineering.netlify.app`).

**Better way (updates by git push):**
1. Put this folder in a GitHub repo.
2. Netlify > Add new site > Import from GitHub > choose the repo. Build command: empty. Publish directory: `/`.
3. Every push to GitHub updates the live site.

**Enquiry form emails:** Netlify > your site > Forms > "enquiry" > Settings & usage >
Form notifications > Add email notification > `dynamecengineer@gmail.com`.
(If Forms is not enabled, turn on "Form detection" in the same place and redeploy.)

**Custom domain:** Netlify > Domain management > Add a domain. Either buy it through Netlify,
or buy it elsewhere (GoDaddy, Hostinger, etc.) and point its DNS to Netlify as shown there.
HTTPS is turned on automatically.

## Animations

All in `js/main.js` (section 4) and the end of `css/style.css`:
- Home page: the blueprint drawing of a CNC machine draws itself as you scroll, then lights up
  the conveyor, coolant tank, frame and hydraulics one by one with the matching service text.
- Home page: the "33 years on the shop floor" statement lights up word by word; client names scroll in two rows.
- Every page: headline entrance on load, section headings fade up once, frosted header,
  cross-fade between pages, highlighted sub-menu on the Services page.
All are switched off for visitors who ask their device for reduced motion.

## HTTPS (SSL)

Netlify gives the site a free Let's Encrypt certificate and renews it automatically,
for both `*.netlify.app` and a custom domain (Netlify > Domain management > HTTPS).
Nothing to install or renew by hand.

## Enquiry form on the preview

On the GitHub Pages preview (`*.github.io`) or when a page is opened straight from disk,
"Send Enquiry" opens WhatsApp instead, because Netlify Forms only works on Netlify.
On Netlify (both `*.netlify.app` and the real domain) the form submits normally.

## TODO for Version 2 (search the files for `TODO`)

- [ ] Photos of workshop and work → add a Gallery page and swap into the hero/About page
- [ ] Confirm WhatsApp number → `js/main.js` (WHATSAPP_NUMBER) and `wa.me/...` links in every page
- [ ] GSTIN (typed by the client) → footer in every page
- [ ] Working hours → contact.html
- [ ] Exact Google Maps pin → contact.html iframe (Google Maps > Share > Embed a map > copy the src)
- [ ] Domain → sitemap.xml and robots.txt, then submit sitemap in Google Search Console
- [ ] Confirm "Machine Tool Reconditioning" wording on services.html and about.html
- [ ] Remove the PREVIEW-ONLY `noindex` line from every page before going live
- [ ] Once the real domain is live: turn off GitHub Pages (repo Settings > Pages) so there is no duplicate copy
- [ ] Real logo, if the client has one → replace `images/logo-mark.svg`
