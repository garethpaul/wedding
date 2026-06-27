# Historical Mapbox Alert Response Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Correct and preserve truthful response guidance for the open historical Mapbox secret alert.

**Architecture:** The dependency-free static checker requires the completed plan and a canonical owner-action sentence in README, SECURITY, VISION, and CHANGES. The repository leaves the GitHub alert open until provider-side evidence exists.

**Tech Stack:** Node.js static contract checker and Markdown documentation.

status: completed

---

### Task 1: Add the failing contract

**Files:**
- Modify: `scripts/check_wedding_contracts.js`

**Step 1: Require the plan and canonical guidance**

Require the response plan and the exact sentence in maintained guidance.
Reject any future claim that GitHub secret scanning has no open alert.

**Step 2: Verify RED**

Run: `make lint`
Expected: FAIL on missing plan and maintained guidance.

### Task 2: Correct the repository evidence

**Files:**
- Modify: `README.md`
- Modify: `SECURITY.md`
- Modify: `VISION.md`
- Modify: `CHANGES.md`

State that historical Mapbox secret alerts remain open until the credential
owner verifies provider-side revocation or rotation. Do not expose the value or
claim provider remediation.

### Task 3: Verify and close

Run `make check`, external-directory `make check`, hostile documentation
mutations, JavaScript syntax checks, `git diff --check`, and current-tree
secret scanning. Record actual evidence before changing status to completed.

### Verification completed

- Red-first `make lint` failed on the missing canonical README guidance and,
  after the documentation update, on this deliberately incomplete plan.
- An isolated completion candidate passed the static checker, 27 Node tests,
  deterministic CSS generation, and JavaScript syntax validation.
- Removing the canonical sentence independently from `SECURITY.md` and
  `CHANGES.md` failed on the intended response-boundary assertion.
- The authoritative repository and external-directory `make check`, diff,
  current-tree secret scan, and hostile-mutation results are recorded in
  `CHANGES.md`; hosted exact-head evidence is added before merge.
