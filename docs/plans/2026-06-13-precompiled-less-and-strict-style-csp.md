---
title: "build: Precompile Less and remove unsafe inline styles"
type: build
date: 2026-06-13
---

# Precompile Less And Tighten Style CSP

## Status: Planned

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
