# Wedding Referrer Policy

## Status: Completed

## Context

The wedding site already limits the embedded map iframe referrer behavior, but
page and static asset responses did not set a site-wide referrer policy. A
global header keeps outbound navigation and third-party asset requests from
receiving page URLs by default.

## Objectives

- Preserve the existing Express route and static asset behavior.
- Add a site-wide `Referrer-Policy: no-referrer` header.
- Ensure the header middleware runs before static asset serving.
- Cover the header in static contracts and package tests.

## Work Completed

- Added `helmet.referrerPolicy({ policy: 'no-referrer' })` before static asset
  middleware.
- Added a Supertest assertion for `Referrer-Policy`.
- Extended the static contract checker and completed-plan coverage.
- Updated README, VISION, and CHANGES.

## Verification

- `node scripts/check_wedding_contracts.js`
- `npm --prefix app test`
- `make check`
- `make verify`
- `git diff --check`

## Follow-Up Candidates

- Evaluate a content security policy for the legacy inline scripts.
- Move third-party script versions into documented dependency notes.
