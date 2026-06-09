# Wedding XSS Protection Header

## Status: Completed

## Context

The wedding site already applies several legacy browser hardening headers before
static asset serving. For the archived dependency set, Helmet still exposes the
legacy `X-XSS-Protection` middleware, and the site can keep that response header
explicit and covered like the other browser headers.

## Objectives

- Preserve the existing Express route and static asset behavior.
- Add `X-XSS-Protection: 1; mode=block` to page and static asset responses.
- Ensure the header middleware runs before static asset serving.
- Cover the header in static contracts and package tests.

## Work Completed

- Added `helmet.xssFilter()` before static asset middleware.
- Added a Supertest assertion for `X-XSS-Protection` on a routed page.
- Extended the static contract checker and completed-plan coverage.
- Updated README, VISION, and CHANGES.

## Verification

- Negative check: `node scripts/check_wedding_contracts.js` failed before
  `helmet.xssFilter()` was added.
- `node scripts/check_wedding_contracts.js`
- `make check`
- `make verify`
- `git diff --check`

## Follow-Up Candidates

- Evaluate a content security policy for the legacy inline scripts.
- Review whether the archived dependency set should be refreshed separately.
