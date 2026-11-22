# Academy conversion audit

## Setup and source decisions

- Working branch: `academy-only-conversion` (created from the clean `master` worktree; `main` was not edited).
- The brochure is the content source of truth. Full public name: **Quasar Robotics & Automation Academy**; compact name: **Quasar Academy**.
- Visible website and email use `www.quasarrobotics.com` and `admissions@quasarrobotics.com`.
- The existing canonical host `www.qusaraengg.com` is retained in metadata and sitemap pending owner confirmation; its spelling is an unresolved domain decision and is not to be presented as the academy's contact website.
- Unconfirmed PLC brands, weekend options, dates, fees, schedules, certification bodies, employer names, and instructor biographies are excluded.
- The brochure's exact placement claim is retained only as “100% Dedicated Placement Assistance”; it is not presented as a job guarantee.
- Visual decision: preserve the existing site's dark technical design tokens, typography, spacing, radii, and motion system; apply brochure content, not a wholesale brochure redesign. Keep motion respectful of `prefers-reduced-motion`.

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
| `sitemap.xml`, `robots.txt` | Rewrite/update | Remove retired Services URL; keep current canonical host pending confirmation. |
| `favicon.svg`, `img/logo.png`, `img/whatsapp.svg` | Keep | Existing site assets; no new factual claims. |
| `img/quasar-mark.svg`, `img/robot-cell.svg`, `img/plc-controls.svg`, `img/machine-vision.svg` | Keep | Academy mark and existing technical illustrations. |

## Banned-term and legacy-content decisions

Repo-wide search terms were reviewed in context: `service`, `quote`, `manufactur`, `client`, `factory job`, `after-sales`, `retrofit`, `panel`, `SCADA services`, `maintenance`, `industry work`, `owners`, `placeholder`, `qusara`, `hello@`, `team training`, and `machine fixed`.

| Match category | Decision |
|---|---|
| Service-company offers, factory/client sales, repair/maintenance, company-training options, and quote CTAs | Remove from public academy copy and navigation. The sole legacy Services route redirects to `/training/`. |
| `panel`, `SCADA`, `commissioning`, and related automation terms used as curriculum topics, lab equipment, or capstone learning | Retain only where supported by the brochure; these are course content, not service offers. |
| `qusara` in the old canonical URL | Keep only in canonical/OG URL metadata, sitemap, and robots sitemap pointer until the owner confirms the canonical domain. |
| `placeholder`, internal draft notes, and `hello@` | Remove from live copy/configuration. |
| Service-specific phrases in old page source or routing aliases | Delete or redirect; do not retain hidden or stale page content. |

## Audit notes

- Static HTML pages share contact and brand values through `site-config.json`; PHP reads the same JSON for its mail recipient.
- Optional extras (interactive ladder demo and three.js previews) are deferred; not required for the core academy conversion.
- Production contact-form delivery and canonical-domain behavior require verification on the deployed host/Netlify preview.
