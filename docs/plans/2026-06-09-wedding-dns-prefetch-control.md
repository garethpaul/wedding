# Wedding DNS Prefetch Control

## Status: Completed

## Context

The wedding site already applies several browser hardening headers before
serving static assets. It still allowed browser DNS prefetching by default,
which can disclose outbound hostnames from historical third-party template
links before a guest intentionally follows those links.

## Objectives

- Preserve existing routes, templates, and static asset behavior.
- Add `X-DNS-Prefetch-Control: off` to routed and static responses.
- Ensure the middleware runs before static asset serving.
- Extend static and runtime checks for the header.

## Work Completed

- Added `helmet.dnsPrefetchControl()` before static middleware.
- Added a Supertest assertion for `X-DNS-Prefetch-Control: off`.
- Extended `scripts/check_wedding_contracts.js` with middleware ordering,
  runtime-test, and completed-plan coverage.
- Updated README, VISION, and CHANGES.

## Verification

- `node scripts/check_wedding_contracts.js`
- `make check`
- `make verify`
- `git diff --check`

## Follow-Up Candidates

- Evaluate a content security policy for the legacy inline scripts.
- Review historical HTTP outbound links in event templates.
