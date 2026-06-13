---
title: "build: Precompile Less and remove unsafe inline styles"
type: build
date: 2026-06-13
---

# Precompile Less And Tighten Style CSP

## Status: Completed

## Context

The shared layout serves `main.less` directly and executes a vendored browser
Less compiler on every page load. That compiler injects generated style blocks,
which is why the Content Security Policy still permits `style-src
'unsafe-inline'`. The site has no authored inline style attributes or `<style>`
blocks, so compiling the existing Less source during the package build can
remove both the runtime compiler and the unsafe CSP exception.

## Requirements

- R1. Pin the maintained `less@4.6.4` compiler as a development dependency and
  expose a deterministic package build command.
- R2. Compile `public/css/main.less` to a tracked `public/css/main.css` artifact
  without source maps or external network access.
- R3. Load only the compiled stylesheet from the shared layout and remove the
  browser-side Less compiler asset.
- R4. Remove `'unsafe-inline'` from `style-src` while preserving the exact
  external stylesheet origins used by reviewed SRI-pinned resources.
- R5. Add runtime and dependency-free contracts plus hostile mutations for the
  build command, compiled artifact, layout references, removed compiler, and
  strict CSP.
- R6. Preserve all routes, rendered content, SRI metadata, and existing
  security headers.

## Implementation

1. Update `app/package.json` and the lockfile with the exact Less compiler.
2. Generate `app/public/css/main.css`, switch the layout to it, and remove
   `app/public/js/less.js`.
3. Tighten Helmet's style directive and update runtime/static verification,
   documentation, and the repository build target.

## Verification

- Run a clean `npm ci`, deterministic CSS regeneration, `npm audit`, and the
  full local and external-working-directory `make check` gates under explicit
  timeouts.
- Reject mutations for reintroduced browser Less, stale compiled CSS,
  `'unsafe-inline'`, missing compiler pins, and weakened tests.
- Validate workflow YAML, JavaScript syntax, lockfile integrity, HTML/template
  references, intended paths, artifacts, conflict markers, whitespace, and
  changed-line credential patterns.
- Browser-test the rendered home page and stylesheet when the local browser
  harness is available; otherwise record the unavailable tool explicitly.

## Scope Boundaries

- Do not redesign the site, rewrite the Less source, change CDN versions,
  remove SRI, alter routes, or add production dependencies.
- Do not merge or close any pull request without explicit owner authorization.

## Verification Results

- `timeout 120s npm --prefix app run build` regenerated the tracked stylesheet
  successfully from `main.less` with source digest
  `08e2eaf7b7ae14f8bf336e256d80658c9877178f2d4b1d389cfaa55ca96f3e9a`.
- `timeout 120s npm --prefix app test` passed all 21 runtime tests, including
  compiled stylesheet delivery, removed browser Less references, and the strict
  style CSP.
- `node scripts/check_wedding_contracts.js` reached only this plan-completion
  gate before the status was updated, confirming the implementation contracts
  were satisfied.
- `timeout 180s npm --prefix app ci` installed and audited 127 locked packages
  with zero vulnerabilities.
- Two bounded `npm --prefix app run build` executions produced identical
  `main.css` SHA-256
  `1be7bea9434cb72a9721819a21105ee877fbab75a16bd253331e3364b936b280`.
- Both `timeout 180s npm --prefix app audit` and the production-only audit
  reported zero vulnerabilities.
- Eight isolated hostile mutations were rejected for restored unsafe inline
  styles, direct Less loading, a browser compiler reference or asset, stale
  compiled CSS, an unpinned compiler, unsafe Less JavaScript evaluation, and
  removed runtime coverage.
- `timeout 240s make check` and the external-working-directory equivalent both
  passed the dependency-free contracts, all 21 runtime tests, and the CSS build.
