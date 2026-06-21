# Checkout Credential Contract Hardening

Status: Completed

## Scope

Keep the Check and CodeQL workflows verification-only by ensuring their pinned
checkout steps do not persist the GitHub token. Strengthen the dependency-free
contract so unrelated workflow text cannot satisfy that security boundary.

## Baseline

Both workflows already used immutable checkout revisions and set
`persist-credentials: false`, but the contract only searched each complete file
for that setting. A decoy comment or command could therefore hide a checkout
step with writable or default credential behavior.

## Implementation

- Define the reviewed checkout block once in the contract checker.
- Require that exact block once in each workflow.
- Exercise writable credentials, a missing `with` block, and a decoy setting
  outside checkout as hostile contract mutations.
- Reject a second checkout or duplicate credential setting that could override
  the reviewed boundary.
- Restore CodeQL's workflow-qualified category identity after the prior
  `/language:*` override produced a neutral pull-request aggregate.
- Document the binding in the README and change log.

## Verification

- `npm ci --prefix app`
- `npm audit --prefix app --audit-level=low`
- `make check` from the repository root and through the absolute Makefile from
  an external working directory
- Hostile copies of each workflow with writable, missing, decoy-only,
  duplicate, and additional-checkout credential settings fail at the intended
  checkout-isolation assertion
- Exact-head CodeQL analysis reports the workflow-qualified Actions and
  JavaScript/TypeScript configurations without a neutral aggregate
- `git diff --check` and repository integrity checks
