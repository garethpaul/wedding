# Form Data Advisory Remediation

## Status: Completed

## Context

A fresh locked install began reporting GHSA-hmw2-7cc7-3qxx against
development-only `form-data` 4.0.5 through Supertest and Superagent. The
advisory covers CRLF injection through unescaped multipart field names and
filenames. The compatible 4.0.6 release resolves the audit without changing a
direct dependency or runtime application source.

## Requirements

- Refresh only the transitive lock entry needed to resolve the advisory.
- Keep direct dependency declarations, application behavior, templates,
  routes, headers, CSS, and deployment boundaries unchanged.
- Add a fail-closed contract for the exact patched `form-data` version.
- Record the dependency path, advisory, validation, and remaining scope in the
  maintained documentation.

## Verification Plan

- clean `npm ci --prefix app --ignore-scripts`
- `npm audit --prefix app`
- repository-root and external-directory `make check`
- Node.js tests, deterministic CSS build, lockfile contract, diff, artifact,
  and secret-pattern review

## Scope Boundary

- Do not restore or modify deployment credentials or historical security
  delivery branches.
- Do not change direct package versions or add a package override.
- Do not merge or close stacked pull requests without owner authorization.

## Work Completed

- Updated the lock entry from `form-data` 4.0.5 to 4.0.6.
- Added a static contract that rejects any other locked version.
- Documented the advisory and patched dependency floor.

## Verification

- A clean 127-package install completed from the updated lockfile.
- `npm audit --prefix app` reported zero vulnerabilities.
- `make check` passed from the repository root and through the absolute
  Makefile path from an external directory, including 21 Node.js tests and a
  deterministic CSS build with no tracked output drift.
- Diff, generated-artifact, and added-secret-pattern checks passed.
