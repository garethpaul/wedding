# Wedding CDN Integrity and CodeQL

Status: Completed

## Problem

The shared layout loads fixed-version styles and scripts from several CDNs
without Subresource Integrity metadata. A compromised CDN response could
therefore execute with the site's existing script privileges, and two such
loads are open CodeQL findings. The current pull-request head also has no
CodeQL analysis to prove the findings are absent after remediation.

## Plan

1. Add SHA-384 integrity hashes and anonymous CORS mode to every external
   fixed-version stylesheet and script in the shared layout.
2. Extend portable contracts to reject any remote script or stylesheet that
   lacks `integrity` or `crossorigin="anonymous"`, and pin the expected hashes.
3. Harden the canonical Check workflow with a fixed Ubuntu runner,
   credential-free checkout, concurrency cancellation, and manual dispatch.
4. Add immutable-pinned actions and JavaScript/TypeScript CodeQL analysis with
   least privilege, bounded jobs, fixed Ubuntu, and canonical triggers.
5. Run the full Node test/audit gate, workflow parsing, external hash
   verification, hostile mutations, and exact-head hosted verification.

## Verification

- All 18 current Express route, accessibility, asset, and security-header tests
  passed after replaying the work onto the newer `master` line.
- `npm audit --prefix app` reported zero known vulnerabilities.
- `make check` passed the portable contracts and all 18 installed-dependency
  Express tests.
- The original remediation verified all six then-external CDN assets. Current
  `master` serves Less from the repository, so the delivery branch preserves
  that stronger boundary and pins the five remaining external resources.
- Ruby parsed both workflow files, Node syntax validation passed for the
  checker, and `git diff --check` passed.
- Six isolated mutations were rejected for missing integrity, changed
  integrity, missing anonymous CORS, a mutable CodeQL action, persisted checkout
  credentials, and an injected third workflow.
- At implementation head `b0a2a253a345490a63a6c786b9444b69f5805671`,
  push Check run `27426368586` and pull-request Check run `27426369724` passed
  Node.js 20 and 22, and CodeQL run `27426369740` passed actions and
  JavaScript/TypeScript analysis. The pull-request head reported zero open
  code-scanning and Dependabot alerts. One previously documented historical
  Mapbox secret-scanning alert remains open pending owner-side token rotation.
- The default-branch delivery branch was rebuilt from current `origin/master`
  rather than merging the diverged intermediate base. It preserved Express 5,
  the built-in Node test runner, local Less, inline-script removal, and image
  accessibility while adding the HTTPS, five-resource SRI, and CodeQL changes.
- On the combined delivery tree, `npm ci --prefix app`, `npm audit --prefix app`,
  `make check`, all 18 tests, and `git diff --check` passed with zero known npm
  vulnerabilities.
