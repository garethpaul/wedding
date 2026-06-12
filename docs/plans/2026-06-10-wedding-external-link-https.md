# Wedding external link HTTPS migration

status: completed

## Goal

Prevent visitor-facing accommodation and activity links from navigating through
plaintext HTTP.

## Changes

- Converted active external links in the accommodation and explore templates to HTTPS.
- Added a static contract rejecting `href="http://` in public templates.
- Left vendored source comments and standards identifiers unchanged because they are not navigable page links.

## Verification

- Focused template scan passed with no `href="http://` destinations.
- `npm --prefix app test` passed all 16 tests.
- `npm audit --prefix app` reported zero vulnerabilities.
- `make check` passed the contract checker and all 16 application tests.
- Hostile plaintext-link mutations using normal and mixed-case, single-quoted
  attribute syntax were rejected by the contract checker.
- `git diff --check` passed.
