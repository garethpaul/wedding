# Wedding Form Action Policy

## Status: Completed

## Context

The site already had a Content Security Policy for scripts, styles, frames,
objects, and base URI changes, but it did not include a `form-action`
directive. The historical site does not rely on cross-origin form submissions,
so injected forms should not be able to post event-page data to arbitrary
external destinations.

## Objectives

- Preserve the existing static route and template behavior.
- Keep the historical CSP source allowlist intact.
- Add `form-action 'self'` to the site-wide CSP.
- Cover the directive in both dependency-free and Supertest header checks.

## Work Completed

- Added `formAction: ["'self'"]` to the Helmet CSP configuration.
- Added static contract coverage for the Express CSP configuration.
- Added runtime Supertest coverage for the emitted `form-action 'self'`
  directive.
- Updated README, SECURITY, VISION, and CHANGES.

## Verification

- `node scripts/check_wedding_contracts.js`
- `npm --prefix app test`
- `make lint`
- `make test`
- `make build`
- `make check`
- `git diff --check`
