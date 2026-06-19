# Wedding Deep Review Consolidation

Status: In Progress

## Scope

Review and consolidate pull requests #1 through #9 without deploying the site
or using repository credentials. Preserve the seven static routes while
verifying visitor links, browser controls, dependency integrity, deterministic
styles, repository-root safety, and verification-only automation.

## Findings

- The maintained #3-#9 stack removes the obsolete Travis decrypt/deploy path,
  removes its encrypted Google Cloud archive from the current tree, denies
  unused browser capabilities, pins CDN assets with SRI, precompiles Less,
  protects the Make root, documents local development, and pins patched
  development-only `form-data` 4.0.6.
- The stack did not include #2's visitor-link HTTPS migration or CodeQL
  workflow, leaving 28 plaintext external links and two default-branch CodeQL
  CDN findings unresolved until integration.
- The application exposes no form or body-processing route. The song-request
  page is informational only, unknown POST routes return 404, and CSP limits
  any future form action to the same origin. CSRF, spam, validation, and guest
  data leakage therefore have no active submission surface in this tree.
- GitHub secret scanning and a redacted full-history Gitleaks scan identify one
  historical Mapbox token location. The retired encrypted deployment archive
  remains in Git history and cannot prove Google Cloud or Travis revocation.

## Implementation

- Preserve the #3-#9 maintained stack as the consolidation base.
- Apply the reviewed #2 HTTPS destination updates and add a rendered-route
  regression test plus a dependency-free template contract.
- Restore immutable-pinned CodeQL analysis for Actions and JavaScript with
  least-privilege permissions, bounded runners, and non-persisted checkout
  credentials. Apply the same checkout boundary to the primary Check workflow.
- Keep deployment metadata historical and verification-only; do not add a
  deployment workflow or credential.

## Verification

- Record the final local, mutation, dependency-audit, history-scan, and hosted
  results here after the exact consolidation head passes.

## Owner Actions

- Revoke the historical Mapbox token and resolve secret-scanning alert #1 only
  after provider-side revocation is confirmed.
- Delete or disable the historical `gpj-wedding` Google Cloud service-account
  key and inspect its audit logs for unexpected use.
- Delete the retired Travis encrypted key/IV variables and disable the legacy
  repository in Travis CI if it still exists.
- Consider a separately coordinated history rewrite only after provider-side
  revocation; repository cleanup alone does not invalidate copied secrets.
