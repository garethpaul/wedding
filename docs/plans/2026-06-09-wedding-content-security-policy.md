# Wedding Content Security Policy

status: completed

## Context

The site already sent transport, framing, MIME-sniffing, download, legacy XSS,
DNS-prefetch, and referrer headers, but it did not define which origins are
allowed to load scripts, styles, frames, fonts, images, or connections. Because
the templates intentionally rely on historical CDNs, inline scripts, Google
Analytics, the Zola registry widget, and an OpenStreetMap iframe, the policy
needs to document and bound those dependencies instead of blocking them
accidentally.

## Completed Scope

- Added Helmet Content Security Policy middleware before static asset handling.
- Restricted defaults to same-origin resources.
- Allowed only the historical external script, style, analytics, registry,
  font, and map origins already used by the templates.
- Blocked plugin object content and restricted base URI changes.
- Added runtime and dependency-free contract checks for the policy.
- Updated the maintenance docs so CSP remains part of the checked baseline.

## Verification

- `make check`
- `git diff --check`
