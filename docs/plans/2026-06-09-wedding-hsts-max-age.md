# Wedding HSTS Max-Age

Status: Completed

## Context

The Express app enables Helmet HSTS before static asset handling, but the
configured `maxAge` used `31536000000`. The vendored Helmet/HSTS middleware
expects seconds, so that value represented a roughly 1000-year policy rather
than the intended one-year policy.

## Plan

- Change the HSTS max-age to `31536000`, one year in seconds.
- Use the documented `includeSubDomains` option spelling.
- Tighten the Supertest header assertion to the exact HSTS value.
- Extend `scripts/check_wedding_contracts.js` so future edits reject
  millisecond-style HSTS values.

## Verification

- `node scripts/check_wedding_contracts.js`
- `make check`
- `make verify`
- `git diff --check`

The npm test suite runs when the checked-in `app/node_modules` dependency tree
is present.
