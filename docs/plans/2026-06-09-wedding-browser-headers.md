# Wedding Browser Headers

## Status: Completed

## Context

The Express app already disabled implementation headers and applied HSTS before
static assets, but it did not explicitly assert baseline browser hardening
headers for clickjacking and MIME sniffing. A static wedding site should keep
those defaults simple and verifiable.

## Objectives

- Preserve the existing routes and static asset behavior.
- Add clickjacking protection with `X-Frame-Options: DENY`.
- Add MIME sniffing protection with `X-Content-Type-Options: nosniff`.
- Keep security middleware before static asset serving.
- Extend tests and static contracts for the headers.

## Work Completed

- Added `helmet.frameguard({ action: 'deny' })` before static middleware.
- Added `helmet.noSniff()` before static middleware.
- Extended Supertest coverage for `X-Frame-Options` and
  `X-Content-Type-Options`.
- Extended `scripts/check_wedding_contracts.js` and updated README, VISION, and
  CHANGES.

## Verification

- `node scripts/check_wedding_contracts.js`
- `make check`
- `make verify`
- `git diff --check`

## Follow-Up Candidates

- Add Content Security Policy in a dedicated pass after inventorying inline
  styles, client-side Less, and embedded map requirements.
- Normalize template path construction through a shared render helper.
