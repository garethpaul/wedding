# Wedding Deep Review Consolidation

Status: Completed

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

- A clean `npm ci --prefix app --ignore-scripts` installed 127 locked packages,
  and `npm audit --prefix app --audit-level=low` reported zero vulnerabilities.
- Repository-root and external-directory `make check` passed all 23 route,
  header, asset, SRI, accessibility, visitor-link, and 404 tests.
- Rebuilding the tracked stylesheet produced byte-identical output.
- All five CDN resources reproduced their committed SHA-384 values from fresh
  downloads. All 34 external links completed on HTTPS; the official Sundial
  replacement returned 200. Bot-protected sites returned 403/406, and the
  personal Zola registry remained the only unresolved 404.
- The current application rendered no form, registered no body-processing or
  submission route, and rejected a synthetic `/song-requests` POST with 404.
- Five hostile mutations were rejected: a plaintext visitor link, mutable
  CodeQL action, vulnerable `form-data` lock entry, missing SRI value, and
  caller-overridden Make root.
- A redacted Gitleaks scan covered 123 commits and found only the historical
  Mapbox location already tracked by GitHub secret-scanning alert #1. The
  changed-file credential-pattern scan found no candidate.
- Exact implementation head `7104578b2d9606f49e95f6a90fc6780f7f6d47c5`
  passed Check push run `27851043107`, Check pull-request run `27851044448`,
  and CodeQL run `27851044431` for Actions and JavaScript/TypeScript.
- Post-merge CodeQL identified two checker-only findings. Follow-up replaces
  regex HTML-comment removal with a tested parser that rejects nested or
  unterminated comments, and evaluates removed script hosts only within the
  extracted CSP `scriptSrc` segment.
- The advanced workflow uses the prior `/language:<language>` analysis
  categories so GitHub can reconcile historical default-branch alerts against
  current fixed results instead of retaining stale category-specific records.

## Owner Actions

- Revoke the historical Mapbox token and resolve secret-scanning alert #1 only
  after provider-side revocation is confirmed.
- Delete or disable the historical `gpj-wedding` Google Cloud service-account
  key and inspect its audit logs for unexpected use.
- Delete the retired Travis encrypted key/IV variables and disable the legacy
  repository in Travis CI if it still exists.
- Consider a separately coordinated history rewrite only after provider-side
  revocation; repository cleanup alone does not invalidate copied secrets.
