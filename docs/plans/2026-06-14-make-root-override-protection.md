# Protect the Make Repository Root from Overrides

## Status: Completed

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

## Work Completed

- Protected the Makefile-derived root while preserving Node and npm overrides.
- Added exact-line checker contracts and registered this completed plan.

## Verification

- JavaScript syntax and the focused Makefile contract passed.
- A clean install added and audited 127 locked packages with zero known
  vulnerabilities.
- Local, external-directory, and hostile-root `make check` runs passed under
  240-second timeouts with all 21 runtime tests and the CSS build.
- Eight hostile root, checker, Node/npm override, build, and plan-status
  mutations were rejected.
- The compiled CSS SHA-256 remained
  `1be7bea9434cb72a9721819a21105ee877fbab75a16bd253331e3364b936b280`;
  YAML, artifact, whitespace, and secret audits passed.
