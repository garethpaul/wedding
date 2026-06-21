# Changes

## 2026-06-21

- Isolated repository verification from caller-controlled Make startup files,
  shell state, execution modes, root overrides, and Node/npm expressions.
- Added adversarial Make authority coverage and pinned hosted verification to
  `/usr/bin/make` without changing the wedding application or credential history.

## 2026-06-19

- Replaced remaining plaintext visitor destinations with reviewed HTTPS links
  and added rendered-route plus static regression coverage.
- Added immutable-pinned, least-privilege CodeQL analysis for Actions and
  JavaScript, and disabled checkout credential persistence in verification.
- Replaced regex comment stripping in the static contract checker with a
  tested fail-closed parser and tightened removed-host checks to exact CSP
  source segments after post-merge CodeQL review.
- Preserved the repository's legacy per-language CodeQL category so current
  clean scans reconcile and close historical alerts from the same analysis.

## 2026-06-17

- Refreshed the development-only `form-data` lock entry from 4.0.5 to 4.0.6
  to resolve GHSA-hmw2-7cc7-3qxx without changing direct dependencies or
  runtime application code.
- Added a fail-closed lockfile contract for the patched transitive version.

## 2026-06-14

- Added a reproducible local development guide covering Node versions, the
  nested package, lockfile install, deterministic CSS, verification, local
  routes, browser smoke checks, privacy, and the non-deployment boundary.

## 2026-06-13

- Replaced the browser-side Less compiler with deterministic build-time CSS,
  pinned `less@4.6.4`, and removed `unsafe-inline` from `style-src`.
- Added source-digest, layout, dependency, runtime, and hostile-mutation
  contracts for the tracked compiled stylesheet.
- Added reviewed SHA-384 Subresource Integrity pins and anonymous CORS mode to
  every third-party Bootstrap, jQuery, and fullPage.js resource.
- Added rendered-page and dependency-free contracts for the exact CDN
  URL-to-digest allowlist.

## 2026-06-12

- Removed the obsolete Travis decrypt/deploy pipeline and its tracked encrypted
  Google Cloud credential archive without rewriting repository history.
- Added static contracts and ignore rules that reject restored credential
  containers, extracted service-account files, and legacy deployment commands.
- Documented that GitHub Actions is verification-only and that provider-side
  key and Travis-variable retirement remains an explicit owner action.

## 2026-06-10

- Added English document-language and mobile viewport metadata, decorative
  alternatives for redundant navigation graphics, and concise descriptions for
  story photos, with static and rendered-page regression coverage.
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
