#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app', 'app.js');
const specPath = path.join(root, 'app', 'spec.js');
const packagePath = path.join(root, 'app', 'package.json');
const lockPath = path.join(root, 'app', 'package-lock.json');
const workflowPath = path.join(root, '.github', 'workflows', 'check.yml');
const expressPlanPath = path.join(root, 'docs', 'plans', '2026-06-08-wedding-express-hardening.md');
const mapPlanPath = path.join(root, 'docs', 'plans', '2026-06-08-wedding-tokenless-map.md');
const poweredByPlanPath = path.join(root, 'docs', 'plans', '2026-06-08-wedding-powered-by-header.md');
const browserHeadersPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-browser-headers.md');
const referrerPolicyPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-referrer-policy.md');
const downloadOptionsPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-download-options.md');
const xssProtectionPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-xss-protection.md');
const dnsPrefetchPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-dns-prefetch-control.md');
const contentSecurityPolicyPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-content-security-policy.md');
const formActionPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-form-action-policy.md');
const hstsMaxAgePlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-hsts-max-age.md');
const modernizationPlanPath = path.join(root, 'docs', 'plans', '2026-06-10-wedding-node-modernization.md');
const templatesPath = path.join(root, 'app', 'public', 'templates');
const appSource = fs.readFileSync(appPath, 'utf8');
const specSource = fs.readFileSync(specPath, 'utf8');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const workflowSource = fs.readFileSync(workflowPath, 'utf8');
const templateSource = fs.readdirSync(templatesPath)
  .filter((fileName) => fileName.endsWith('.html'))
  .map((fileName) => fs.readFileSync(path.join(templatesPath, fileName), 'utf8'))
  .join('\n');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(!appSource.includes('res.send(200,'), 'Express routes must use res.status(200).send(...)');
assert(appSource.includes("app.disable('x-powered-by')"), 'Express must disable the X-Powered-By header');
assert(appSource.includes('app.use(helmet({'), 'Express must enable Helmet defaults');
assert(appSource.includes("frameguard: { action: 'deny' }"), 'Express must enable frameguard');
assert(appSource.includes("referrerPolicy: { policy: 'no-referrer' }"), 'Express must enable a no-referrer policy');
assert(appSource.includes('contentSecurityPolicy: {'), 'Express must enable a content security policy');
assert(appSource.includes("defaultSrc: [\"'self'\"]"), 'CSP must default to same-origin resources');
assert(appSource.includes("scriptSrc: [") && appSource.includes("'https://www.google-analytics.com'") && appSource.includes("'https://widget.zola.com'"), 'CSP must bound script sources to the historical page dependencies');
assert(appSource.includes("styleSrc: [") && appSource.includes("'https://netdna.bootstrapcdn.com'") && appSource.includes("\"'unsafe-inline'\""), 'CSP must bound style sources while allowing legacy inline styles');
assert(appSource.includes("frameSrc: ['https://www.openstreetmap.org']"), 'CSP must restrict frame sources to OpenStreetMap');
assert(appSource.includes("objectSrc: [\"'none'\"]"), 'CSP must block plugin object content');
assert(appSource.includes("baseUri: [\"'self'\"]"), 'CSP must restrict base URI changes');
assert(appSource.includes("formAction: [\"'self'\"]"), 'CSP must restrict form submissions to the site origin');
assert(appSource.includes('maxAge: 31536000'), 'HSTS maxAge must be one year in seconds');
assert(!appSource.includes('maxAge: 31536000000'), 'HSTS maxAge must not use millisecond-style values');
assert(appSource.includes('includeSubDomains: true'), 'HSTS must include subdomains with the documented option spelling');
assert(appSource.indexOf('app.use(helmet({') < appSource.indexOf("app.use('/static'"), 'Helmet must run before static assets');
assert(
  appSource.includes("express.static(path.join(__dirname, 'public'))") ||
    appSource.includes('express.static(path.join(__dirname, "public"))'),
  'static assets must be resolved relative to app.js'
);
assert(appSource.includes('require.main === module'), 'server startup must be guarded by require.main');
assert(appSource.includes('module.exports = app'), 'app.js must export the Express app for tests');
assert(!appSource.includes('module.exports = server'), 'app.js must not export a live server instance');
assert(!specSource.includes('server.close()'), 'tests should not depend on closing a require-cached server');
assert(specSource.includes("response.headers['x-powered-by']"), 'tests must assert X-Powered-By is absent');
assert(specSource.includes('/static/css/main.less'), 'tests must cover a static asset response');
assert(specSource.includes('Strict-Transport-Security'), 'tests must assert HSTS on static assets');
assert(specSource.includes('max-age=31536000; includeSubDomains'), 'tests must assert the exact HSTS max-age and subdomain policy');
assert(specSource.includes('X-Content-Type-Options'), 'tests must assert no-sniff on static assets');
assert(specSource.includes('X-Download-Options'), 'tests must assert download protection on static assets');
assert(specSource.includes(".expect('X-XSS-Protection', '0')"), 'tests must disable obsolete browser XSS auditors');
assert(specSource.includes('Cross-Origin-Opener-Policy'), 'tests must assert modern opener isolation');
assert(specSource.includes('Cross-Origin-Resource-Policy'), 'tests must assert modern resource isolation');
assert(specSource.includes('X-DNS-Prefetch-Control'), 'tests must assert DNS prefetch control on routed pages');
assert(specSource.includes('X-Frame-Options'), 'tests must assert frameguard on routed pages');
assert(specSource.includes('Referrer-Policy'), 'tests must assert referrer policy on routed pages');
assert(specSource.includes('Content-Security-Policy'), 'tests must assert content security policy on routed pages');
assert(specSource.includes("script-src 'self' 'unsafe-inline'"), 'tests must assert the CSP script directive');
assert(specSource.includes("frame-src https://www.openstreetmap.org"), 'tests must assert the CSP frame directive');
assert(specSource.includes("form-action 'self'"), 'tests must assert the CSP form-action directive');
assert(!templateSource.includes('access_token=pk.'), 'templates must not embed Mapbox access tokens');
assert(templateSource.includes('openstreetmap.org/export/embed.html'), 'wedding-day map must use a tokenless map embed');
assert(templateSource.includes('title="Park City wedding map"'), 'map iframe must have a descriptive title');
assert(templateSource.includes('referrerpolicy="no-referrer-when-downgrade"'), 'map iframe must bound referrer disclosure');
assert(packageJson.engines.node === '>=20', 'package must require Node.js 20 or newer');
assert(packageJson.dependencies.express === '4.22.2', 'Express must use the maintained 4.x release');
assert(packageJson.dependencies.helmet === '8.2.0', 'Helmet must use the current maintained release');
assert(packageJson.dependencies.nunjucks === '3.2.4', 'Nunjucks must replace abandoned Swig');
assert(!packageJson.dependencies.swig, 'Swig must not remain in runtime dependencies');
assert(packageJson.devDependencies.mocha === '11.7.6', 'Mocha must be a current development dependency');
assert(packageJson.devDependencies.supertest === '7.2.2', 'Supertest must be a current development dependency');
assert(packageJson.overrides.diff === '8.0.3', 'the patched diff override must remain pinned');
assert(packageJson.overrides['serialize-javascript'] === '7.0.5', 'the patched serializer override must remain pinned');
assert(fs.existsSync(lockPath), 'npm installs must be reproducible through package-lock.json');
assert(workflowSource.includes('permissions:\n  contents: read'), 'CI permissions must be read-only');
assert(workflowSource.includes('node-version: [20, 22]'), 'CI must cover Node.js 20 and 22');
assert(workflowSource.includes('npm ci --prefix app'), 'CI must install from the lockfile');
assert(workflowSource.includes('npm audit --prefix app'), 'CI must audit the dependency graph');
assert(workflowSource.includes('run: make check'), 'CI must run the repository verification gate');
assert(workflowSource.includes('actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10'), 'checkout must use an immutable revision');
assert(workflowSource.includes('actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e'), 'setup-node must use an immutable revision');

function assertCompletedPlan(planPath, label) {
  assert(fs.existsSync(planPath), `${label} plan must live under docs/plans`);
  const planSource = fs.readFileSync(planPath, 'utf8');
  assert(planSource.toLowerCase().includes('status: completed'), `${label} plan must be completed`);
  assert(planSource.includes('make check'), `${label} plan must document make check verification`);
}

assertCompletedPlan(expressPlanPath, 'wedding hardening');
assertCompletedPlan(mapPlanPath, 'wedding tokenless map');
assertCompletedPlan(poweredByPlanPath, 'wedding powered-by header');
assertCompletedPlan(browserHeadersPlanPath, 'wedding browser headers');
assertCompletedPlan(referrerPolicyPlanPath, 'wedding referrer policy');
assertCompletedPlan(downloadOptionsPlanPath, 'wedding download options');
assertCompletedPlan(xssProtectionPlanPath, 'wedding XSS protection');
assertCompletedPlan(dnsPrefetchPlanPath, 'wedding DNS prefetch control');
assertCompletedPlan(contentSecurityPolicyPlanPath, 'wedding content security policy');
assertCompletedPlan(formActionPlanPath, 'wedding form action policy');
assertCompletedPlan(hstsMaxAgePlanPath, 'wedding HSTS max age');
assertCompletedPlan(modernizationPlanPath, 'wedding Node modernization');

console.log('wedding contracts passed');
