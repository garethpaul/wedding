# Wedding Local Development

## Toolchain And Package Layout

Use Node.js 20 or newer. GitHub Actions verifies Node.js 20, 22, and 24, so use
one of those lines when reproducing hosted behavior. The Node package and
lockfile live under `app/`; repository scripts and the Makefile live at the
repository root.

Install exactly from the lockfile without changing dependency metadata:

```bash
npm ci --prefix app
```

From `app/`, the equivalent command is `npm ci`. Do not commit `app/node_modules`,
npm cache data, editor files, credentials, private guest data, or temporary
browser output.

## Build And Verify

Run these commands from the repository root:

```bash
npm --prefix app run build
npm --prefix app test
npm audit --prefix app
make check
```

The build compiles `app/public/css/main.less` into the tracked
`app/public/css/main.css`. Edit the Less source, run the build, and review both
files together for intentional style changes. Do not hand-edit generated CSS or
commit an unrelated generated diff.

`npm --prefix app test` runs the Node.js/Supertest route suite. `make check`
also runs dependency-free route, template, asset, security-header, CSP, SRI,
accessibility, and deterministic-CSS contracts. Run the full gate before review.

## Start The Site

From the repository root:

```bash
npm --prefix app start
```

From `app/`, use `npm start`. The server listens on `PORT` when set and defaults
to `8080`, so the default local URL is `http://localhost:8080/`. Stop it with
Ctrl+C after the browser checks.

## Browser Smoke Checklist

Check `/`, `/our-story`, `/the-big-day`, `/accomodation`, `/explore`,
`/song-requests`, and `/registry` without changing event content.

- Navigation links reach the expected route and remain usable with a keyboard.
- Story, accommodation, navigation, and registry images load with the intended
  alternative-text behavior.
- The layout remains readable at narrow mobile and desktop widths.
- The local script initializes page behavior without inline JavaScript errors.
- Response headers retain CSP, Referrer-Policy, Permissions-Policy,
  X-Content-Type-Options, X-Frame-Options, and the other tested Helmet defaults.
- Browser developer tools show no unexpected third-party script, stylesheet, or
  tracking request beyond the reviewed CDN and tokenless map dependencies.

Record the Node and npm versions, commit SHA, commands, route results, viewport
sizes, and any unresolved console or network errors. Do not attach private guest
data, personal browser state, credentials, or unreviewed location changes.

## Deployment Boundary

The maintained repository is a historical, local-only site. It is not currently
deployable from this tree.

Local development and GitHub Actions do not deploy the site. `app/app.yaml` and
`app/dispatch.yaml` are historical metadata, not an active deployment workflow.
Any future deployment requires a newly provisioned external identity, a separate
reviewed workflow, and explicit owner authorization. Never restore the retired
Travis credential archive, service-account files, or deployment commands.
