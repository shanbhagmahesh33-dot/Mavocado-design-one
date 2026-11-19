# Mavocado FAQs, policies and privacy controls

## Included
- faqs.html: 14 questions, category filters, live search, no-results reset and native accessible accordions.
- privacy.html: updated privacy information in the current dark editorial layout.
- terms.html: website terms, distinct from commissioned project agreements.
- cookies.html: cookie/storage inventory and interactive preference management.
- policy-pages.css / policy-pages.js: scoped components using the current design system.
- privacy-controls.css / privacy-controls.js: consent banner, native settings dialog, stored choice, withdrawal and cross-tab updates.
- analytics.js: optional Google Analytics is gated behind explicit acceptance.
- Updated footer links, form privacy notices and analytics loading order across 52 studio pages.
- sitemap.xml: four policy/FAQ URLs listed once, with correct canonical URLs on each page.

The current GitHub source already included SOVEN. Its first position, project images and standalone website are preserved. Existing CNAME and site-config.js remain unchanged.

## Publish
1. Back up the repository.
2. Extract either the full ZIP or update-only ZIP and copy its contents into the repository root, preserving folder paths. Replace matching files; retain other repository files when using the update-only package.
3. Commit and push to main. Do not upload the ZIP itself as the website.
4. Keep GitHub Pages custom domain mavocado.design and Enforce HTTPS enabled.
5. After deployment, check /faqs.html, /privacy.html, /terms.html and /cookies.html. Test Cookie Settings from the footer in a fresh browser session.

No production deployment, external message or Search Console request was performed by this update.

## Consent behaviour
- Google Analytics does not load until optional analytics is accepted.
- A saved choice is valid for 180 days. Missing, malformed or expired records do not grant analytics permission.
- Rejecting or withdrawing disables the configured tracker and attempts to remove accessible GA cookies. Custom events stop. Provider data already received is not deleted by browser consent controls.
- Choices propagate to other open tabs on the same origin.
- If storage is unavailable, the choice applies only to the current page session.
- Local preview never loads production analytics; the production-host branch was checked with isolated JavaScript tests and mocked script insertion, not live Google requests.
- The original second, inline Google tag on roomies.html was removed so it no longer bypasses consent.
- These controls cover studio pages. Standalone portfolio demonstrations keep their existing functionality; this update does not add unrelated tracking to demos.

## Content review before public use
The policy text is a publication draft, not a legal compliance certification. Confirm the legal operator/correspondence details, actual retention and deletion practices, all third-party providers and Analytics cookie/account settings. Have the legal wording reviewed for the business and audiences you serve. No unconfirmed registered entity, street address, fixed response deadline or contractual court venue has been invented.

Google Analytics cookie durations in the table are Google's defaults; browsers and account settings can differ. Update the revision date when the approved version is published. The Terms govern website use; project pricing, IP transfer, cancellation, liability and support remain in individual project agreements.
