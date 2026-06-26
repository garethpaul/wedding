# Wedding Local-Only Repository Status

## Status: Completed

## Context

The maintained tree has no deployment workflow or credential, while historical
App Engine metadata remains tracked. Existing guidance described that boundary
but left the roadmap undecided between archival and continued deployability.

## Requirements

- Classify the maintained repository as historical and local-only without
  archiving the GitHub repository or changing application behavior.
- State that the tracked tree is not currently deployable and that historical
  App Engine metadata does not establish deployment readiness.
- Require explicit owner authorization, a newly provisioned least-privilege
  identity, a separately reviewed workflow, and renewed security review before
  any future deployable reclassification.
- Keep README, local development, roadmap, security, and change-history guidance
  aligned through executable regression coverage.

## Verification Plan

- Add a focused Node test that fails before the status appears in all maintained
  guidance.
- Run the static contract checker and focused Node tests.
- Mutate each required status location and completed-plan status to confirm the
  repository gate fails closed.
- Run `make check` from both repository and external directories.

## Scope Boundary

- Do not archive the GitHub repository or claim that the event content is
  unsupported.
- Do not change application behavior, dependencies, locks, generated CSS,
  templates, routes, headers, workflows, or historical App Engine metadata.
- Do not add deployment automation, credentials, provider configuration, or a
  deployable identity.

## Work Completed

- Declared the maintained repository historical and local-only across README,
  local development, roadmap, and security guidance.
- Replaced the unresolved roadmap choice with an explicit reclassification
  boundary that treats historical metadata as non-authoritative.
- Added focused Node and static checker contracts plus completed-plan
  registration.

## Verification

- The focused repository-status test failed before documentation changed and
  passed after the status was aligned.
- Static, mutation, full-gate, artifact, and hosted verification are recorded
  against the exact pull-request head before merge.
