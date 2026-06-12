# Wedding external link HTTPS migration

status: planned

## Goal

Prevent visitor-facing accommodation and activity links from navigating through
plaintext HTTP.

## Changes

- Converted active external links in the accommodation and explore templates to HTTPS.
- Added a static contract rejecting `href="http://` in public templates.
- Left vendored source comments and standards identifiers unchanged because they are not navigable page links.

## Verification

Run `make check` and `git diff --check`.
