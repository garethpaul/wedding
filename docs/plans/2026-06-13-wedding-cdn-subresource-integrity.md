# Wedding CDN Subresource Integrity

Status: Completed

## Problem

The layout loads Bootstrap, jQuery, and fullPage.js resources from third-party
CDNs allowed by Content Security Policy, but the tags do not pin the expected
resource bytes. A compromised or unexpectedly changed CDN response would be
trusted by the page.

## Plan

1. Fetch the five exact external stylesheet and script URLs with redirects and
   bounded timeouts.
2. Record SHA-384 Subresource Integrity values for the fetched bytes.
3. Add `integrity` and `crossorigin="anonymous"` to every external CDN tag.
4. Add rendered-page and dependency-free contracts requiring exact URL/hash
   pairs, one integrity value per CDN resource, and no unpinned CDN tags.
5. Document the supply-chain boundary and completed verification.

## Verification

- All five recorded SHA-384 digests matched independently refetched exact URLs;
  each resource also returned permissive cross-origin response headers.
- The focused rendered-page SRI test passed.
- The full `make check` gate passed all 20 Supertest cases and dependency-free
  contracts locally and from an external working directory.
- `npm audit --omit=dev` and the full 111-package audit both reported zero
  vulnerabilities.
- Eight hostile mutations were rejected for removed or altered hashes, a
  weakened algorithm, missing CORS mode, an unpinned tag, removed rendered
  coverage, and stale plan status.
- `git diff --check`, artifact review, and focused secret review passed.
