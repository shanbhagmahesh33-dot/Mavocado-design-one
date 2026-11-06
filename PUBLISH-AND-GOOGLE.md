# Publish this update

1. Extract the ZIP. Upload the extracted contents to the root of the GitHub repository that publishes mavocado.design. Keep index.html, assets/, .nojekyll and CNAME at the top level; do not upload the ZIP as the website.
2. Keep GitHub Pages set to main / (root). Wait for the Pages deployment to finish, then hard refresh the site.
3. Check the desktop Work menu, all three first-row work thumbnails, mobile menu and a case-study banner.

## Google Analytics

The site now uses the GA4 web-stream Measurement ID from your screenshot: G-TVKCWCVX87. site-config.js sets the ID; analytics.js loads the Google tag once per page on mavocado.design and www.mavocado.design. Preview hosts do not send analytics.

The GTM-W5VB4GPZ value in the other screenshot is a Tag Manager container ID. This release uses direct GA4 installation. Do not also install a second GA4 tag through that container, which could duplicate measurements.

After deploying, open the live site with analytics-blocking extensions disabled, then check Analytics Realtime or Tag Assistant. The account-side “data collection isn't active” notice may not clear immediately. Source configuration and local initialization were tested; delivery to your private Analytics property cannot be confirmed until the ZIP is deployed and live traffic reaches it.

## Google Search Console

The ZIP includes crawlable pages, canonical URLs on https://mavocado.design/, robots.txt, sitemap.xml, Open Graph metadata and organization structured data linking the existing Instagram, LinkedIn and Behance profiles. The homepage title now begins with Mavocado Design.

1. Add/verify a Domain property for mavocado.design in Search Console. If verification is pending, copy the exact TXT record Google supplies into GoDaddy DNS. Do not invent or reuse another property's token.
2. Submit https://mavocado.design/sitemap.xml in Sitemaps.
3. Inspect https://mavocado.design/ in URL Inspection, run Test Live URL, then request indexing if eligible. Repeat for /work.html, /services.html and /contact.html as appropriate.
4. Check Page indexing for exclusions, alternate canonicals, crawl failures or “Discovered — currently not indexed.” Search results alone cannot establish why a page is missing.
5. Link this domain from your real Instagram, LinkedIn and Behance bios. Keep the studio name consistent as Mavocado Design. Check that the Instagram account is public and allows eligible public content to appear in search where that setting is available.

Search Console ownership and indexing requests were not performed in this task. Website code cannot force Google to index or rank the studio, and it cannot force Google to display Instagram results. Discovery may take days or longer; no ranking or inclusion is guaranteed.

References:
- https://developers.google.com/tag-platform/gtagjs
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/appearance/structured-data/organization
