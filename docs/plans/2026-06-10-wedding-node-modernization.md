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
- Upgrade Express 5, Helmet, and Supertest to maintained releases.
- Replace Mocha with Node.js's built-in test runner, removing its deprecated
  transitive dependency path and the overrides previously needed to patch it.
- Use Helmet's current aggregate middleware, including modern cross-origin
  headers and the safe `X-XSS-Protection: 0` policy for obsolete browser
  auditors.
- Add read-only GitHub Actions verification on Node.js 20, 22, and 24 with
  immutable action revisions and a manual dispatch path.
- Enforce the dependency, workflow, and security-header contracts statically.

## Verification

- `npm ci --prefix app`
- `npm audit --prefix app`
- `make check`
