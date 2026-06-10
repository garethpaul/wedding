# Wedding Node Modernization

Status: completed

## Goal

Replace the abandoned Swig and legacy middleware stack with maintained Node.js
dependencies while preserving the event site's routes, templates, and browser
security policy.

## Changes

- Require Node.js 20 or newer and lock the dependency graph.
- Replace Swig with Nunjucks, whose supported template syntax covers the site's
  existing inheritance, blocks, includes, and escaped variables.
- Upgrade Express, Helmet, Mocha, and Supertest to maintained releases.
- Use Helmet's current aggregate middleware, including modern cross-origin
  headers and the safe `X-XSS-Protection: 0` policy for obsolete browser
  auditors.
- Add read-only GitHub Actions verification on Node.js 20 and 22 with immutable
  action revisions.
- Enforce the dependency, workflow, and security-header contracts statically.

## Verification

- `npm ci --prefix app`
- `npm audit --prefix app`
- `make check`
