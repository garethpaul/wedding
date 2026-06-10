# Wedding Image Accessibility

Status: Completed

## Goal

Make the historical event site understandable to assistive technology and
correctly scaled on mobile devices without changing its visual presentation.

## Scope

- Declare the document language and standard mobile viewport metadata.
- Mark navigation graphics as decorative because adjacent headings already
  provide the link names.
- Give each story photo concise, meaningful alternative text.
- Enforce the metadata and all 11 active image alternatives in static and
  rendered-page tests.

## Verification

- `make check`
- `npm --prefix app test`
- Mutation check: removing an `alt` attribute from an active image causes the
  contract checker to fail.

## Outcome

The home page now exposes useful document semantics, avoids repetitive link
announcements, and describes meaningful photographs. Regression checks reject
missing alternatives and unexpected changes to the active image inventory.
