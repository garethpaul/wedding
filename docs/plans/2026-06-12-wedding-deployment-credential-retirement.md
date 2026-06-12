# Wedding Deployment Credential Retirement

Status: Completed

## Problem

The public repository still tracks `credentials.tar.gz.enc` and a legacy
Travis configuration that decrypts the archive with repository variables,
extracts `client-secret.json`, authenticates a Google Cloud service account,
and deploys the site. The pipeline targets Node.js 6 and an inactive Travis
path, while maintained verification and delivery now run through GitHub
Actions. Encryption prevents direct plaintext inspection but does not make a
deployment credential archive appropriate source content or prove the
underlying service-account key has been revoked.

## Priority

This is the highest actionable Wedding risk because the artifact is a current,
high-entropy credential container in a public tree and the only consumer is an
obsolete deployment pipeline. Removing it reduces current exposure and
prevents accidental reactivation without claiming historical revocation.

## Requirements

1. Remove `credentials.tar.gz.enc` and the obsolete `.travis.yml` decrypt and
   deployment workflow from the current tree without rewriting history.
2. Extend `scripts/check_wedding_contracts.js` to reject the encrypted archive,
   Travis configuration, decrypted credential filenames, OpenSSL decrypt
   commands, and legacy `gcloud auth` or `gcloud app deploy` automation across
   the tracked tree, not only at the historical filenames.
3. Update `README.md`, `SECURITY.md`, `VISION.md`, and `CHANGES.md` so deployment
   ownership is truthful: GitHub Actions verifies the site, no repository
   workflow deploys it, and provider-side key/variable revocation remains an
   owner action.
4. Preserve the application, routes, templates, App Engine metadata, current
   GitHub Actions verification, and existing security/accessibility contracts.
5. Record completed local and hosted verification in this plan before the work
   is considered finished.

## Implementation

- Delete the two legacy deployment artifacts and add explicit ignore rules for
  the encrypted/decrypted archive and extracted service-account file.
- Add deployment-retirement assertions to the existing dependency-free static
  checker and require this completed plan alongside the other canonical plans.
- Document that historical Git objects and external Travis/Google Cloud state
  are outside the current-tree cleanup boundary.

## Verification

- `npm ci --prefix app` installed the locked dependency graph and
  `npm audit --prefix app` reported zero known vulnerabilities.
- All 18 Node/Supertest route, asset, accessibility, and security tests passed.
- JavaScript syntax validation and `git diff --check` passed.
- Scan changed lines and tracked filenames for private keys, credential values,
  service-account JSON, encrypted credential containers, and deployment-secret
  variable names without printing any candidate value.
- Verify hostile mutations restoring the archive, Travis decrypt path,
  renamed encrypted credential content, decrypted credential filenames, and
  `gcloud` deployment are rejected.
- Canonical `make check`, hostile mutation results, and exact-head hosted run
  identifiers are recorded below as they complete.
- `make check` passed the dependency-free contracts and all 18 installed
  Node/Supertest tests on the completed local tree.
- Six staged hostile mutations were rejected: a renamed `.enc` archive,
  restored `.travis.yml`, `client-secret.json`, service-account activation,
  `gcloud app deploy`, and a renamed JSON service-account document.
- The changed-file scan covered the complete intended diff and found zero
  credential-value or private-key matches without printing candidate values.
- Implementation head `b870f5ca67df0e11ddb45d23a52a24d663ebd416`
  passed the complete Node.js 20, 22, and 24 matrix in push run `27435628978`
  and pull-request run `27435639096`.
- Pull request #3 was open, clean, and mergeable at that implementation head
  with all six hosted checks successful. Its `master` base does not yet carry a
  CodeQL workflow, so an empty PR-scoped code-scanning alert query is recorded
  only as an API observation, not as CodeQL analysis evidence.

## Risks And Boundaries

- Deleting the current-tree archive does not remove historical Git blobs.
- No credential contents will be decrypted, printed, or externally verified.
- Provider-side service-account revocation and Travis variable deletion cannot
  be inferred from repository changes and remain explicit owner follow-up.
- History rewriting is excluded because it changes published commit IDs and
  requires separate repository-owner coordination after credential revocation.
