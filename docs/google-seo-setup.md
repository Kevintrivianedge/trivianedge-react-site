# Google SEO report setup

`npm run seo:report` pulls Google's own data for trivianedge.com:

- **PageSpeed Insights**: official Lighthouse scores (Performance, Accessibility, Best Practices, SEO) and real-user Core Web Vitals from the Chrome UX Report. This is the field data behind Search Console's Core Web Vitals report.
- **Search Console**: per-URL index status and Google-selected canonical, rich-result detection, sitemap errors, and 28-day clicks, impressions, CTR and position.

Reports are saved to `docs/seo-reports/<date>.md`. The script exits with code 2 when anything is below target (95+ on every Lighthouse category, and PASS on every URL inspection), so it can gate CI.

## One-time setup (about 10 minutes)

1. **Create a Google Cloud project** at https://console.cloud.google.com/projectcreate (for example `trivianedge-seo`).
2. **Enable two APIs** in that project (APIs & Services → Library):
   - *PageSpeed Insights API*
   - *Google Search Console API*
3. **Create an API key** (APIs & Services → Credentials → Create credentials → API key). Restrict it to the PageSpeed Insights API. This is `PSI_API_KEY`.
4. **Create a service account** (IAM & Admin → Service accounts → Create). It needs no Cloud roles. Open it → Keys → Add key → JSON. Save the file as `.secrets/gsc-sa.json` in this repo (already git-ignored).
5. **Give the service account access to Search Console.** In https://search.google.com/search-console choose the `trivianedge.com` property → Settings → Users and permissions → Add user. Paste the service account's email (`…@…iam.gserviceaccount.com`) and choose **Restricted** (read-only is enough).
6. If the property is a URL-prefix property rather than a Domain property, set `GSC_PROPERTY=https://www.trivianedge.com/`.

## Run

```bash
export PSI_API_KEY=your-key
export GSC_SA_KEY=.secrets/gsc-sa.json
npm run seo:report                 # both sections, default key URLs
npm run seo:report -- --psi        # PageSpeed only
npm run seo:report -- --gsc --urls /,/services,/blog
```

## Notes

- Search Console has no single percentage score. "Everything green" means every inspected URL returns `PASS`, sitemaps show 0 errors, and the Core Web Vitals report shows no Poor or Needs-improvement URLs. The script checks all three.
- Field data (CrUX) needs enough real Chrome traffic. Low-traffic URLs show "no field data"; that is expected, not an error.
- The keyless PageSpeed endpoint shares one global daily quota and is usually exhausted, which is why an API key is required.
