# Wedding Powered-By Header

## Status: Completed

## Context

The Express app set HSTS for static assets, but it still used the framework
default that exposes `X-Powered-By: Express`. The site does not need to disclose
its server framework in responses.

## Objectives

- Preserve the existing route and static asset behavior.
- Disable Express implementation disclosure headers.
- Cover the header contract in dependency-free checks and the Supertest suite.
- Keep the verification path available through `make check`.

## Work Completed

- Added `app.disable('x-powered-by')` during Express app setup.
- Added a Supertest assertion that rendered pages omit `X-Powered-By`.
- Extended `scripts/check_wedding_contracts.js` to enforce the app and test
  contracts.
- Updated README, VISION, and CHANGES with the new header guardrail.

## Verification

- `node scripts/check_wedding_contracts.js`
- `make check`
- `make verify`
- `git diff --check`

## Follow-Up Candidates

- Review historical HTTP outbound links in event templates.
- Decide whether the event site should be archived or still deployable.
