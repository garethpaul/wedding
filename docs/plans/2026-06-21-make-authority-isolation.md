# Make Authority Isolation

## Status: Completed

## Context

The repository protected its derived root, but GNU Make still accepted caller-
controlled Node/npm expressions, shell state, startup files, execution modes,
and later single-colon recipe replacements.

## Implementation

- Froze reviewed Node and npm values, the recipe shell, and the canonical
  repository root for all public verification targets.
- Rejected untrusted startup files, overridden Makefile lists, non-executing or
  error-ignoring modes, and later recipe replacement.
- Added an adversarial authority harness and pinned hosted CI to
  `/usr/bin/make check`.

## Verification

- Repository and external-directory `make check` exercise the static contracts,
  authority harness, npm tests, and CSS build when dependencies are installed.
- The authority harness covers public target/root/shell combinations, literal
  hostile tool paths, raw Make syntax, Makefile-list and startup boundaries,
  later recipe and variable attempts, dependency-skip containment, caller
  `MAKEFLAGS`, and unsafe execution modes.

## Trust Boundary

GNU Make parses earlier startup files before this Makefile can reject them, and
an explicit later `override` directive remains caller authority. Default
`node`/`npm` names are resolved through `PATH`; CI installs reviewed runtimes
before running the gate. These boundaries are tested and documented rather
than claimed as preventable by the checked-in Makefile.

## Scope Boundary

This change does not modify application routes, rendered content, dependencies,
deployment configuration, credential history, or provider-side key retirement.
