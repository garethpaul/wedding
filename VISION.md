## Wedding Vision

Wedding is a Node.js/Express website for a wedding, with static pages for the
story, day-of information, accommodation, exploration, song requests, and
registry.

The repository is useful as a personal event site with App Engine deployment
metadata, Swig templates, static assets, security middleware, and encrypted
credentials.

The goal is to preserve the event site while keeping personal information,
deployment credentials, and historical dependency choices explicit.

The current focus is:

Priority:

- Preserve the static route structure and templates
- Keep encrypted credentials encrypted
- Avoid exposing unnecessary implementation headers
- Maintain deployment metadata and Travis context
- Treat Swig and dependency versions as historical until documented

Next priorities:

- Add setup notes for local development and deployment
- Document how encrypted credentials are managed
- Review historical HTTP outbound links in event templates
- Decide whether the site is archived or still deployable

Contribution rules:

- One PR = one focused route, template, asset, deployment, or documentation change.
- Do not commit plaintext credentials or private guest data.
- Keep personal details intentional and reviewed.
- Separate dependency modernization from content edits.

## Security And Responsible Use

Canonical security policy and reporting:

- [`SECURITY.md`](SECURITY.md)

Event sites can expose personal schedules, locations, guest information, and
deployment secrets. Credentials should remain encrypted, and private event data
should be reviewed before publishing.

## What We Will Not Merge (For Now)

- Plaintext credentials
- Private guest or RSVP data
- Unreviewed personal-location changes
- Dependency rewrites mixed with event content changes

This list is a roadmap guardrail, not a permanent rule.
Strong user demand and strong technical rationale can change it.
