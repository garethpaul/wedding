# Changes

## 2026-06-26 13:38 PDT - P3 - Refresh the exact Less compiler pin

### Summary

Updated the build-only Less compiler from 4.6.4 to 4.6.7 while preserving the
tracked stylesheet byte-for-byte and retaining exact reproducible installs.

### Work completed

- Pinned `less@4.6.7` in the nested manifest and lockfile.
- Bound the reviewed registry integrity and `make-dir@5.1.0` resolution in the
  dependency-free repository checker.
- Confirmed the refreshed compiler produces no tracked CSS diff.
- Removed the obsolete optional `pify` and `semver` transitive packages through
  the upstream Less dependency refresh.

### Threads

- Started: none — the patch update was completed directly.
- Continued: none.
- Stopped: none.

### Files changed

- `app/package.json` and `app/package-lock.json` — update the exact compiler and
  reviewed transitive graph.
- `scripts/check_wedding_contracts.js` — pins the manifest, lockfile, tarball,
  transitive helper, and completed plan.
- `README.md`, `SECURITY.md`, `VISION.md`, and
  `docs/plans/2026-06-26-less-4.6.7-refresh.md` — document scope and evidence.

### Validation

- Pre-update baseline — 27 Node tests passed, the CSS build was byte-identical,
  and static contracts passed.
- Post-update focused gate — 27 Node tests passed, `npm audit --prefix app`
  reported zero vulnerabilities, and `npm outdated --prefix app` returned no
  packages.
- Host Node 18 emitted the expected package-engine warning; supported Node 20,
  22, and 24 verification remains the authoritative full gate.
- Disposable Node 20, 22, and 24 containers each passed `make check`, including
  27 Node tests, deterministic CSS generation, static contracts, and all 30
  Make authority cases.
- An isolated hostile mutation of the Less tarball integrity failed on the
  intended checker assertion, and `git diff --check` passed.
- Hosted Node 20, 22, and 24 verification plus CodeQL Actions and JavaScript
  analysis passed on PR #17.
- `$codex-review` was invoked against `origin/master` but OpenAI authentication
  returned HTTP 401 before analysis; an immutable manual review confirmed the
  local and PR heads matched and found no actionable issue.

### Bugs / findings

- P3: the exact build compiler lagged the current patch release and retained
  older optional directory-helper transitive packages.

### Blockers

- None for local implementation; hosted supported-runtime verification remains
  required before merge.
- The Codex review helper cannot authenticate to the OpenAI API in this
  environment; no model finding was produced or silently ignored.

### Next action

- Re-run exact-head gates after this evidence-only amendment and merge only the
  reviewed hosted-green head.

## 2026-06-25

- Resolved the deployment-status roadmap ambiguity by classifying the maintained
  repository as a historical, local-only site that is not currently deployable
  from the tracked tree.
- Required an explicit owner decision, newly provisioned least-privilege
  identity, separate reviewed workflow, and renewed security review before any
  future deployable reclassification.
- Added test and static-contract coverage so README, local development, roadmap,
  security, completed-plan, and change-history guidance cannot silently drift
  back to an ambiguous deployment claim.

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
