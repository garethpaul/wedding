# Wedding Express Hardening Plan

Date: 2026-06-08

Status: Completed

## Goal

Make the wedding site easier to test and safer to serve by modernizing Express response handling and ensuring security middleware covers static assets.

## Scope

- Move Helmet HSTS middleware before static asset serving.
- Resolve static assets relative to `app.js` instead of the current working directory.
- Replace deprecated `res.send(200, ...)` calls with `res.status(200).send(...)`.
- Export the Express app for tests and guard live server startup behind `require.main`.
- Expand Supertest coverage across all site routes and a static asset HSTS response.
- Add dependency-free contract checks and local Makefile verification targets.

## TDD Notes

- Red: `node scripts/check_wedding_contracts.js` failed with `Error: helmet middleware must run before static assets`.
- Green: `node scripts/check_wedding_contracts.js` passed after moving Helmet, updating route responses, and adding route/static coverage.

## Verification

- `make lint`
- `make test`
- `make build`
- `make verify`
- `make check`
- `git diff --check`
- `npm --prefix app test` passed after installing dependencies locally with `npm --prefix app install --package-lock=false`.
