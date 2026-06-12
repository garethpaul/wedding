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

- All 16 Express route and security-header tests passed.
- `npm audit --prefix app` reported zero known vulnerabilities.
- `make check` passed the portable contracts and all 16 installed-dependency
  Express tests.
- Fresh downloads of all six reviewed CDN assets reproduced the committed
  SHA-384 hashes, and each CDN returned cross-origin access permission.
- Ruby parsed both workflow files, Node syntax validation passed for the
  checker, and `git diff --check` passed.
- Six isolated mutations were rejected for missing integrity, changed
  integrity, missing anonymous CORS, a mutable CodeQL action, persisted checkout
  credentials, and an injected third workflow.
- Exact-head hosted Check and CodeQL verification remains required before the
  pull request is considered ready.
