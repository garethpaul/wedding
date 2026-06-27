# Historical Mapbox Alert Response Design

Status: Completed

## Evidence

GitHub secret scanning reports one open historical Mapbox secret access token
alert in commit `45290ae`. The tokenized iframe was removed from current
`master`, the current template is tokenless, and alert validity is unknown.
The latest `CHANGES.md` entry truthfully states that one alert remains open,
but the owner-response boundary is prose-only and absent from the maintained
security, vision, and verification contracts.

## Options

1. Resolve the alert as revoked without provider evidence.
2. Leave the existing change-history note as the only response guidance.
3. Keep the alert open, correct the evidence, and enforce an owner-only
   revocation/rotation boundary across maintained guidance and verification.

## Decision

Use option 3. Repository cleanup cannot prove provider-side revocation, and a
static contract preserves the truthful existing posture while preventing
future maintenance entries from silently claiming the alert is closed.

## Scope

No token value, historical blob, template behavior, dependency, deployment
status, or application route changes.
