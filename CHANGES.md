# Changes

## 2026-06-09

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
