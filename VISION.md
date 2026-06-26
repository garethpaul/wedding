## Wedding Vision

Wedding is a Node.js/Express website for a wedding, with static pages for the
story, day-of information, accommodation, exploration, song requests, and
registry.

The repository is useful as a personal event site with historical App Engine
metadata, Nunjucks templates, static assets, and security middleware.

The goal is to preserve the event site while keeping personal information,
retired deployment boundaries, and historical dependency choices explicit.

The maintained repository is a historical, local-only site. It is not currently
deployable from this tree.

The current focus is:

Priority:

- Preserve the static route structure and templates
- Keep deployment credentials out of Git, including encrypted archives
- Avoid exposing unnecessary implementation headers
- Keep baseline browser security headers enabled before static assets
- Keep HSTS max-age explicit and bounded to one year
- Keep legacy browser download protection enabled before static assets
- Disable obsolete browser XSS auditors while retaining CSP and modern headers
- Keep DNS prefetching disabled before static assets
- Keep referrer disclosure bounded for page and asset requests
- Keep site-owned JavaScript local and same-origin, with no inline scripts or
  third-party tracking loaders
- Keep Content Security Policy coverage aligned with required static CDN and
  map dependencies
- Pin every third-party CDN script and stylesheet with Subresource Integrity
- Precompile site-owned Less and keep `style-src` free of `unsafe-inline`
- Keep CSP form submissions restricted to the site origin
- Keep visitor-facing outbound links on HTTPS
- Retain App Engine metadata as history without restoring Travis deployment
- Keep the maintained tree local-only unless the owner explicitly authorizes a
  newly provisioned identity and separately reviewed deployment workflow
- Keep the Node.js dependency graph maintained, locked, and audited
- Keep the development-only multipart dependency on the patched `form-data`
  4.0.6 floor
- Keep document metadata and image alternatives accessible without duplicating
  nearby navigation labels
- Keep reproducible local setup, generated CSS, browser smoke checks, and the
  non-deployment boundary explicit

Future reconsideration:

- Reclassify the site as deployable only through an explicit owner decision;
  historical App Engine metadata alone does not establish deployment readiness

Contribution rules:

- One PR = one focused route, template, asset, deployment, or documentation change.
- Do not commit plaintext credentials or private guest data.
- Keep personal details intentional and reviewed.
- Separate dependency modernization from content edits.

## Security And Responsible Use

Canonical security policy and reporting:

- [`SECURITY.md`](SECURITY.md)

Event sites can expose personal schedules, locations, guest information, and
deployment secrets. Credentials must remain outside Git even when encrypted,
and private event data should be reviewed before publishing.

## What We Will Not Merge (For Now)

- Plaintext credentials
- Private guest or RSVP data
- Unreviewed personal-location changes
- Dependency rewrites mixed with event content changes

This list is a roadmap guardrail, not a permanent rule.
Strong user demand and strong technical rationale can change it.
