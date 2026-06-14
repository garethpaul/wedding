# Protect the Make Repository Root from Overrides

## Status: Planned

## Context

The Makefile-derived root anchors security contracts, npm tests, and the
deterministic CSS build, but an ordinary assignment can be replaced from the
command line and redirect those operations away from the reviewed checkout.

## Requirements

- Protect the Makefile-derived root with GNU Make's `override` directive.
- Preserve configurable Node and npm commands and the locked CSS build.
- Require exact protected root and tool override lines in the static checker.
- Pass local, external-directory, and hostile-root full gates.
- Reject root, checker, tool override, build, and plan regressions.
- Preserve runtime, CSP, SRI, workflow, lockfile, and compiled CSS behavior.

## Verification Plan

- focused Makefile contract and JavaScript syntax
- clean npm install/audit plus bounded full gates
- focused mutations and deterministic CSS digest verification
- workflow YAML, template, artifact, whitespace, and secret audits

## Scope Boundaries

- Do not change application behavior, dependencies, templates, workflows, or
  compiled CSS content.
- Do not merge or close stacked pull requests without owner authorization.
