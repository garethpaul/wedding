# Changes

## 2026-06-10

- Added English document-language and mobile viewport metadata, decorative
  alternatives for redundant navigation graphics, and concise descriptions for
  story photos, with static and rendered-page regression coverage.
- Converted visitor-facing accommodation and activity links from HTTP to HTTPS
  and added a static contract preventing plaintext external links.
- Migrated the application from abandoned Swig templates to maintained
  Nunjucks without changing the existing page templates or routes.
- Upgraded to Express 5 and current Helmet and Supertest releases, added a
  reproducible lockfile, and moved tests to Node.js's built-in runner so the
  dependency tree no longer needs Mocha-specific security overrides.
- Adopted Helmet's current browser security defaults, including modern
  cross-origin headers and `X-XSS-Protection: 0`.
- Added immutable, read-only GitHub Actions verification on Node.js 20, 22, and
  24, including manual workflow dispatch.
- Removed inline JavaScript, Google Analytics, and the executable Zola registry
  widget; page initialization now runs from a local static script.
- Tightened `script-src` by removing `unsafe-inline` and obsolete tracking
  origins, with static and runtime regression coverage.
- Made verification independent of the caller's working directory and pinned
  hosted CI to Ubuntu 24.04 with per-branch concurrency cancellation.

## 2026-06-09

- Corrected the Helmet HSTS `maxAge` value to one year in seconds and asserted
  the exact `Strict-Transport-Security` header in tests.
- Added static checker coverage for the HSTS max-age and subdomain policy.
- Added `form-action 'self'` to the site-wide Content Security Policy.
- Added static and runtime coverage for the CSP form-action directive.
- Added a site-wide Content Security Policy for the historical CDN, analytics,
  registry-widget, and map dependencies.
- Added `X-DNS-Prefetch-Control: off` before static asset handling.
- Added static and runtime coverage for the DNS prefetch control header.
- Added `X-Download-Options: noopen` before static asset handling.
- Added static and runtime coverage for the download protection header.
- Added `X-XSS-Protection: 1; mode=block` before static asset handling.
- Added static and runtime coverage for the legacy XSS protection header.
- Added a site-wide `Referrer-Policy: no-referrer` header before static asset
  handling.
- Added static and runtime coverage for the referrer-policy header.
- Added Helmet frameguard and no-sniff middleware before static asset serving.
- Added route/header contract coverage for `X-Frame-Options` and
  `X-Content-Type-Options`.

## 2026-06-08

- Disabled Express `X-Powered-By` responses and added route/header coverage.
- Replaced the tokenized Mapbox iframe with a tokenless embedded map and static template check.
- Tightened docs-plan verification to require recorded `make check` evidence.
- Added a local `make verify` gate with static Express route contract checks.
- Updated Express routes to use `res.status(200).send(...)` instead of deprecated `res.send(200, ...)`.
- Moved Helmet HSTS middleware before static asset serving and added static-asset header coverage.
- Resolved static assets relative to `app.js` instead of the current working directory.
- Exported the Express app for tests and guarded server startup behind `require.main`.
