# Mavocado Design — Portfolio update

Prepared: 23 November 2026

## Upload to GitHub

1. Extract this ZIP.
2. Copy its contents into the root of your existing **mavocado.design** website repository, merging folders and replacing matching files.
3. Keep all other existing pages and files. This is an update package, not a replacement for the entire repository.
4. Commit the changes to your publishing branch. Your existing GitHub Pages workflow can deploy them.
5. After deployment, hard-refresh the homepage, Work page and Auréva page to bypass previously cached styles.

No publishing or repository push has been performed. Your existing CNAME, DNS configuration and deployment workflow are intentionally excluded from this package.

## Changes

- Veyara Jewels is first on Home and Work; Kesar & Kin is second.
- Home Selected Work contains 12 projects in four desktop columns, two tablet columns and one mobile column.
- Removed only from Home Selected Work: Auréva, Veeha Studio, VELAR, Veyra Works, Bluehour and Pip & Pebble. They remain on the Work page.
- Cards use a single-line title, two-line description, project type and tertiary View Work link.
- Added veyara-jewels.html and kesar-and-kin.html, each with a dedicated case study and three MacBook shots.
- Veyara: VELAR-style silver MacBook, lime-green background.
- Kesar & Kin: Veeha-style cobalt MacBook, Mavocado-blue background.
- Fixed Auréva's first gallery wrapper. All six shots now have consistent natural proportions.
- Images use contain/natural-height sizing; no CSS image zoom, stretching or cropping is applied to the updated portfolio images.
- Sharp corners are retained on controls in the updated portfolio pages.
- Updated sitemap includes both new case studies.
- Added a null guard to the existing homepage clock updater so pages without its legacy clock element do not throw an error.

## Project demos

- demos/veyara-jewels/index.html
- demos/kesar-and-kin/index.html

Kesar & Kin uses a dummy phone number, sample address/city, placeholder directions and Instagram/Facebook links. Contact links open an explanatory preview dialog. Testimonials use fictional names and newly written sample reviews. No store contact or social account is contacted by these placeholder controls.

Both demos are front-end concepts. Product/cart/enquiry interactions are local previews; they do not connect to a payment gateway, store backend or live order submission.

Mavocado's own studio phone, email and social links remain intact.

## Validation

Checked desktop and mobile layouts, Home/Work ordering, Work filtering, image enlargement, Auréva's six image aspect ratios, the two new three-image galleries, local assets and demo script syntax. Mobile layouts were checked at a 390px frame width (375px content area with scrollbar) with no horizontal page overflow.

## Package contents

Updated/new HTML, portfolio-refresh-63.css, the common CSS/JS and image/font dependencies used by these pages, both project demos and their local assets. Supporting files preserve the current live site's design language.
