# Wedding Local Development Guide

## Status: Completed

## Context

The repository has a nested Node package, deterministic Less compilation,
security contracts, and a retired deployment path, but local setup is reduced
to a single start command.

## Requirements

- Document supported Node lines, the nested `app/` package, and reproducible
  `npm ci` installation.
- Document stylesheet build, focused tests, full `make check`, and local start
  commands from both repository and package directories.
- Explain generated CSS expectations and forbid committing dependency folders,
  temporary output, credentials, or personal guest data.
- Provide a browser smoke checklist for routes, images, navigation, responsive
  layout, and security headers without changing event content.
- State that local development and GitHub Actions do not deploy the site and
  that historical App Engine metadata is non-authoritative.
- Link the guide from the README and roadmap and protect it with static
  contracts and hostile mutations.

## Verification Plan

- focused local-guide and completed-plan contracts
- `npm ci`, `npm audit`, CSS build, repository and external-directory
  `make check`
- hostile runtime, package-path, install, build, test, start, generated-file,
  privacy, browser-smoke, deployment, roadmap, suite, and plan-status mutations
- final artifact, credential, exact-diff, and hosted verification audits

## Scope Boundary

- Do not change application behavior, content, dependencies, locks, CSS,
  templates, routes, headers, workflows, or deployment metadata.
- Do not restore deployment credentials or automation.
- Do not merge or close stacked pull requests without owner authorization.

## Work Completed

- Added reproducible install, build, test, audit, full-gate, start, browser-smoke,
  generated-file, privacy, and deployment-boundary guidance.
- Linked the guide from repository documentation and made its requirements,
  roadmap priority, checker registration, and completed plan mutation-sensitive.

## Verification

- Focused local-guide and completed-plan contracts passed.
- `npm ci`, `npm audit`, CSS build, and repository/external `make check` passed.
- Thirteen hostile local-guide mutations were rejected across runtime, package
  path, install, build, test, start, generated files, privacy, browser smoke,
  deployment, roadmap, registration, and plan status.
- The 126-package lockfile install and zero-vulnerability audit passed; the CSS
  build produced no diff, and artifact, credential, and exact-diff audits
  passed. Hosted verification is recorded against the exact pull-request head
  after push.
