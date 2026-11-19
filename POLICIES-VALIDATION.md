# Validation — 19 November 2026

- Three new pages and replacement privacy page: one H1 each, page-specific SEO metadata, matching non-www canonical URLs and valid structured data.
- Internal policy section links and local asset references resolved.
- Four sitemap entries present exactly once; CNAME unchanged.
- 52 studio footers include policy links and Cookie Settings; consent script precedes analytics script exactly once.
- Legacy inline Roomies analytics loader removed.
- JavaScript syntax checks passed for all three new/updated scripts.
- Isolated analytics checks passed: unset/rejected consent, explicit opt-in, one-time script injection, saved acceptance, withdrawal suppression, reacceptance, query-free page location and local-preview guard.
- Chrome browser QA: FAQ keyword search, category filtering, expanded answers, no-results reset, settings dialog, rejection, acceptance, saved choice after reload and cross-tab withdrawal.
- Mobile FAQ and Privacy layouts reviewed at 390px and 320px frames, with no document overflow. Mobile cookie table scrolls within its own container.
- Cookie preference dialog fits the narrow mobile frame; section navigation and Terms page checked.
- No real enquiry submissions or live production analytics collection were used in testing.

Remaining launch checks: owner/legal review of business practices and policy wording; production browser confirmation of cookie inventory after deployment; broader physical-device/browser testing as needed.
