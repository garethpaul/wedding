# Wedding Inline Script Removal

Status: Completed

## Context

The site allowed all inline JavaScript in its Content Security Policy to run
page initialization, Google Analytics, and a registry widget. That exception
made injected script markup executable and retained third-party tracking code
that was no longer required for the static wedding archive.

## Changes

- Moved fullPage initialization into a checked-in same-origin script.
- Served the existing Less compiler from the repository instead of a CDN.
- Removed Google Analytics and the executable Zola widget while preserving a
  plain registry link.
- Removed `unsafe-inline`, Google Analytics, and Zola widget origins from the
  script policy.
- Added route, static-contract, CI, and root-independent Make coverage.

## Verification

- `make check`
- `npm audit --prefix app`
- Mutation checks for CSP, templates, local scripts, CI, and Make paths
- `git diff --check`
