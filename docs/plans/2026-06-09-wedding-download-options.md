# Wedding Download Options Header

## Status: Completed

## Context

The wedding site already applies baseline browser security headers before static
asset serving. Downloaded static files should also receive the legacy Internet
Explorer protection header so downloaded content is saved instead of opened
directly in a less isolated browser context.

## Objectives

- Preserve the existing Express route and static asset behavior.
- Add `X-Download-Options: noopen` to page and static asset responses.
- Ensure the header middleware runs before static asset serving.
- Cover the header in static contracts and package tests.

## Work Completed

- Added `helmet.ieNoOpen()` before static asset middleware.
- Added a Supertest assertion for `X-Download-Options` on a static asset.
- Extended the static contract checker and completed-plan coverage.
- Updated README, VISION, and CHANGES.

## Verification

- `node scripts/check_wedding_contracts.js`
- `npm --prefix app test`
- `make lint`
- `make test`
- `make build`
- `make check`
- `make verify`
- `git diff --check`

## Follow-Up Candidates

- Evaluate a content security policy for the legacy inline scripts.
- Review whether the archived dependency set should be refreshed separately.
