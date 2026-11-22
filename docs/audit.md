# Academy conversion audit

## Setup and source decisions

- Working branch: `academy-only-conversion` (created from the clean `master` worktree; `main` was not edited).
- The brochure is the content source of truth. Full public name: **Quasar Robotics & Automation Academy**; compact name: **Quasar Academy**.
- Visible website and email use `www.quasarrobotics.com` and `admissions@quasarrobotics.com`.
- The existing canonical host `www.qusaraengg.com` is retained in metadata and sitemap pending owner confirmation; its spelling is an unresolved domain decision and is not to be presented as the academy's contact website.
- Unconfirmed PLC brands, weekend options, dates, fees, schedules, certification bodies, employer names, and instructor biographies are excluded.
- The brochure's exact placement claim is retained only as “100% Dedicated Placement Assistance”; it is not presented as a job guarantee.
- Visual decision: preserve the existing site's dark technical design tokens, typography, spacing, radii, and motion system; apply brochure content, not a wholesale brochure redesign. The active design uses Outfit, navy `#070e24` / `#0b1633`, surface `#101d40`, text `#eef1fb`, muted `#a9b3d6`, orange `#ff7a1a`, a `22px` radius, `1220px` content width, and the existing shadow/motion rules. The brochure's suggested Unbounded, Manrope, and JetBrains Mono fonts were not adopted because the current system is already established. Keep motion respectful of `prefers-reduced-motion`.

## Repository inventory

| File or path | Decision | Scope |
|---|---|---|
| `.gitignore`, `AGENTS.md` | Keep | Repository and agent configuration; unrelated to public content. |
| `.htaccess`, `_redirects` | Rewrite | Redirect retired service URLs to the programme page and preserve legacy route behavior. |
| `index.html` | Rewrite | Academy-only home, brochure course content, labs, careers, admissions calls to action, metadata. |
| `training/index.html` | Rewrite | Brochure-aligned programme curriculum, lab references, capstone, audience, and admissions CTA. |
| `about/index.html` | Rewrite | Academy mission, vision, teaching approach, values, labs, and campus location. |
| `contact/index.html` | Rewrite | Admissions form and campus/contact information. |
| `privacy/index.html` | Rewrite | Academy enquiry privacy copy; remains subject to legal review. |
| `thank-you/index.html` | Rewrite | Academy enquiry confirmation and admissions follow-up. |
| `services/index.html`, `services.html` | Delete | Retired service-business page and legacy redirect stub; redirect rules cover the old URLs. |
| `about.html`, `contact.html`, `privacy.html`, `thank-you.html`, `training.html` | Keep | Existing legacy route stubs; canonical route redirects remain. |
| `send.php` | Rewrite | Preserve the mail mechanism and send academy enquiry fields to the admissions address from site config. |
| `site-config.json` | Add | Single source for brand, canonical base, visible website/email, phone numbers, WhatsApp, address, and Maps URL. |
| `js/main.js` | Rewrite | Load shared config, populate contact details and structured data, support enquiry/copy interactions, retain carousel and motion behavior. |
| `css/styles.css` | Rewrite/add styles | Preserve existing design system and add layout/form styles for brochure content. |
| `sitemap.xml` | Rewrite | Remove the retired Services URL; keep the current canonical host pending confirmation. |
| `robots.txt` | Keep | Existing sitemap pointer remains on the current canonical host pending confirmation. |
| `favicon.svg`, `img/logo.png`, `img/whatsapp.svg` | Keep | Existing assets; not used as the new visible academy logo. |
| `img/quasar-logo.png`, `img/quasar-icon.png` | Add | Cropped from the owner-provided logo image; the full logo is used in footers and the icon beside the full academy name in headers and as the favicon. |
| `img/quasar-mark.svg`, `img/robot-cell.svg`, `img/plc-controls.svg`, `img/machine-vision.svg` | Keep | Existing academy mark and technical illustrations. |

## Banned-term and legacy-content decisions

Repo-wide case-insensitive search terms were reviewed in context: `service`, `quote`, `manufactur`, `client`, `factory job`, `after-sales`, `retrofit`, `panel`, `SCADA services`, `maintenance`, `industry work`, `owners`, `placeholder`, `qusara`, `hello@`, `team training`, and `machine fixed`.

| Remaining match | Decision |
|---|---|
| `.htaccess:6-7`, `_redirects:1-3` — old `/services/` and `/services.html` paths | Required permanent redirects to `/training/`; they are not public navigation links or service content. |
| `site-config.json:4`, `sitemap.xml:3-7`, `robots.txt:4` — old canonical host | Retained only as the configured canonical base, live-page sitemap host, and sitemap pointer pending owner confirmation. The visible website link uses the brochure's `www.quasarrobotics.com`. |
| `contact/index.html:57,59,62,79` — `placeholder` attributes | Ordinary form-entry hints (name, phone, optional email and message); no internal draft or placeholder contact content remains. |
| `css/styles.css:1425-1428` — `::placeholder` selectors | Styling for those form-entry hints; not user-facing placeholder copy. |
| `about/index.html:38`, `index.html:184`, `training/index.html:74` — commissioning/panel wording | Brochure-aligned capstone exercise: design, program, commission a work cell and present it to a panel. |
| `index.html:64`, `training/index.html:52` — control panels/panels | PLC illustration alt text and electrical curriculum topics, not a service offer. |
| `index.html:152`, `training/index.html:97` — manufacturing | Exact hiring-context language from the brochure's placement section. |
| Service-company offers, factory/client sales, repair/maintenance, company-training options, quote CTAs, unconfirmed PLC brands, and weekend options | No matches remain in public page copy/navigation. |
| `client`, `factory job`, `after-sales`, `retrofit`, `SCADA services`, `maintenance`, `industry work`, `owners`, `hello@`, `team training`, and `machine fixed` | No matches remain in the audited public source files. |
| Internal draft text and obsolete Services-page content | Removed; old Services routes redirect rather than retaining hidden/stale page content. |

## Audit notes

- Static HTML pages share contact and brand values through `site-config.json`; PHP reads the same JSON for its mail recipient.
- Optional extras (interactive ladder demo and three.js previews) are deferred; not required for the core academy conversion.
- The Privacy page content requires owner/legal review before release.
- The PHP runtime is not installed in the current workstation, so PHP lint and actual email delivery could not be exercised locally. Production form delivery and canonical-domain behavior require verification on the deployed host/Netlify preview.
