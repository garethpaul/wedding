# Changes

## 2026-06-08

- Tightened docs-plan verification to require recorded `make check` evidence.
- Added a local `make verify` gate with static Express route contract checks.
- Updated Express routes to use `res.status(200).send(...)` instead of deprecated `res.send(200, ...)`.
- Moved Helmet HSTS middleware before static asset serving and added static-asset header coverage.
- Resolved static assets relative to `app.js` instead of the current working directory.
- Exported the Express app for tests and guarded server startup behind `require.main`.
