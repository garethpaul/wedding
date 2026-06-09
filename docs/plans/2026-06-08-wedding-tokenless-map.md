# Wedding Tokenless Map Plan

Date: 2026-06-08

Status: Completed

## Goal

Remove checked-in map access tokens from the wedding-day page while preserving
an embedded Park City map.

## Scope

- Replace the tokenized Mapbox iframe with a tokenless OpenStreetMap embed.
- Add a descriptive iframe title and bounded referrer policy.
- Extend the dependency-free contract checker to scan templates for embedded
  `access_token=pk.` values.
- Keep the existing Express route and static asset hardening unchanged.

## TDD Notes

- Red: `node scripts/check_wedding_contracts.js` failed with
  `Error: templates must not embed Mapbox access tokens`.
- Green: `node scripts/check_wedding_contracts.js` passed after replacing the
  iframe and adding the completed plan.

## Verification

- `node scripts/check_wedding_contracts.js`
- `make check`
- `git diff --check`
