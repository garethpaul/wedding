# Wedding Permissions Policy

Status: Completed

## Problem

The static wedding site does not use camera, geolocation, or microphone APIs,
but responses do not explicitly disable those browser capabilities. A future
embedded or injected document would otherwise inherit browser defaults rather
than a site-level least-privilege policy.

## Plan

1. Add an exact `Permissions-Policy` header denying camera, geolocation, and
   microphone access.
2. Install the middleware before static assets and routed pages.
3. Add Supertest coverage for both an HTML route and a static asset.
4. Extend the dependency-free contract with exact-value and middleware-order
   checks.

## Verification

- The focused Permissions-Policy Supertest passed for both a routed page and a
  static asset.
- A clean locked install audited 111 packages with zero known vulnerabilities.
- The full `make check` gate passed the dependency-free contracts and all 19
  Node/Supertest runtime tests.
- The same complete gate passed from an external working directory.
- Five hostile mutations were rejected: header removal, policy weakening,
  late middleware placement, removed static coverage, and removed route
  coverage.
- JavaScript syntax validation and `git diff --check` passed.
