# Wedding CDN Subresource Integrity

Status: In Progress

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

- Verify each recorded digest against a freshly fetched exact URL.
- Run the focused rendered-page SRI test.
- Run the full `make check` gate locally and from an external working
  directory.
- Run `npm audit --omit=dev` and the full audit when available.
- Reject hostile mutations for removed or altered hashes, missing CORS mode,
  unpinned tags, and stale plan status.
- Run `git diff --check`, artifact review, and focused secret review.
