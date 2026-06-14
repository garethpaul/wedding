# Wedding Local Development Guide

## Status: Planned

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
