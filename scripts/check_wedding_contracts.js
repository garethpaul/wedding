#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app', 'app.js');
const specPath = path.join(root, 'app', 'spec.js');
const packagePath = path.join(root, 'app', 'package.json');
const lockPath = path.join(root, 'app', 'package-lock.json');
const workflowPath = path.join(root, '.github', 'workflows', 'check.yml');
const siteScriptPath = path.join(root, 'app', 'public', 'js', 'site.js');
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
const inlineScriptPlanPath = path.join(root, 'docs', 'plans', '2026-06-10-wedding-inline-script-removal.md');
const accessibilityPlanPath = path.join(root, 'docs', 'plans', '2026-06-10-wedding-image-accessibility.md');
const deploymentRetirementPlanPath = path.join(root, 'docs', 'plans', '2026-06-12-wedding-deployment-credential-retirement.md');
const permissionsPolicyPlanPath = path.join(root, 'docs', 'plans', '2026-06-13-wedding-permissions-policy.md');
const templatesPath = path.join(root, 'app', 'public', 'templates');
const appSource = fs.readFileSync(appPath, 'utf8');
const specSource = fs.readFileSync(specPath, 'utf8');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const workflowSource = fs.readFileSync(workflowPath, 'utf8');
const siteScriptSource = fs.readFileSync(siteScriptPath, 'utf8');
const templateSource = fs.readdirSync(templatesPath)
  .filter((fileName) => fileName.endsWith('.html'))
  .map((fileName) => fs.readFileSync(path.join(templatesPath, fileName), 'utf8'))
  .join('\n');
const activeTemplateSource = templateSource.replace(/<!--[\s\S]*?-->/g, '');
const trackedFiles = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const forbiddenDeploymentArtifacts = [
  /^\.travis\.ya?ml$/i,
  /\.enc$/i,
  /(^|\/)credentials\.tar\.gz$/i,
  /(^|\/)client-secret\.json$/i
];
for (const trackedFile of trackedFiles) {
  assert(
    !forbiddenDeploymentArtifacts.some((pattern) => pattern.test(trackedFile)),
    `tracked deployment credential artifact is forbidden: ${trackedFile}`
  );
}

const deploymentAutomationSource = trackedFiles
  .filter((trackedFile) =>
    !trackedFile.startsWith('docs/') &&
    trackedFile !== 'scripts/check_wedding_contracts.js' &&
    trackedFile !== 'app/package-lock.json' &&
    /(?:^|\/)(?:[^/]+\.(?:ya?ml|sh|js|json)|Makefile)$/i.test(trackedFile)
  )
  .map((trackedFile) => fs.readFileSync(path.join(root, trackedFile), 'utf8'))
  .join('\n');
[
  /openssl\s+aes-256-cbc/i,
  /gcloud\s+auth\s+activate-service-account/i,
  /gcloud\s+app\s+deploy/i,
  /encrypted_[a-z0-9]+_(?:key|iv)/i,
  /client-secret\.json/i,
  /["']type["']\s*:\s*["']service_account["']/i,
  /["']private_key["']\s*:/i
].forEach((pattern) => {
  assert(!pattern.test(deploymentAutomationSource), `legacy credential deployment automation is forbidden: ${pattern}`);
});

assert(!appSource.includes('res.send(200,'), 'Express routes must use res.status(200).send(...)');
assert(appSource.includes("app.disable('x-powered-by')"), 'Express must disable the X-Powered-By header');
assert(appSource.includes('app.use(helmet({'), 'Express must enable Helmet defaults');
assert(appSource.includes("frameguard: { action: 'deny' }"), 'Express must enable frameguard');
assert(appSource.includes("referrerPolicy: { policy: 'no-referrer' }"), 'Express must enable a no-referrer policy');
assert(appSource.includes('contentSecurityPolicy: {'), 'Express must enable a content security policy');
assert(appSource.includes("defaultSrc: [\"'self'\"]"), 'CSP must default to same-origin resources');
const scriptSources = appSource.split('scriptSrc: [', 2)[1].split(']', 1)[0];
assert(!scriptSources.includes("'unsafe-inline'"), 'CSP script sources must reject inline JavaScript');
assert(!appSource.includes('www.google-analytics.com'), 'CSP must not allow removed Google Analytics endpoints');
assert(!appSource.includes('widget.zola.com'), 'CSP must not allow removed Zola widget scripts');
assert(appSource.includes("styleSrc: [") && appSource.includes("'https://netdna.bootstrapcdn.com'") && appSource.includes("\"'unsafe-inline'\""), 'CSP must bound style sources while allowing legacy inline styles');
assert(appSource.includes("frameSrc: ['https://www.openstreetmap.org']"), 'CSP must restrict frame sources to OpenStreetMap');
assert(appSource.includes("objectSrc: [\"'none'\"]"), 'CSP must block plugin object content');
assert(appSource.includes("baseUri: [\"'self'\"]"), 'CSP must restrict base URI changes');
assert(appSource.includes("formAction: [\"'self'\"]"), 'CSP must restrict form submissions to the site origin');
assert(appSource.includes('maxAge: 31536000'), 'HSTS maxAge must be one year in seconds');
assert(!appSource.includes('maxAge: 31536000000'), 'HSTS maxAge must not use millisecond-style values');
assert(appSource.includes('includeSubDomains: true'), 'HSTS must include subdomains with the documented option spelling');
assert(appSource.indexOf('app.use(helmet({') < appSource.indexOf("app.use('/static'"), 'Helmet must run before static assets');
assert(appSource.includes("res.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=()')"), 'Express must deny unused browser capabilities');
assert(appSource.indexOf("res.set('Permissions-Policy'") < appSource.indexOf("app.use('/static'"), 'Permissions-Policy must cover static assets and routed pages');
assert(
  appSource.includes("express.static(path.join(__dirname, 'public'))") ||
    appSource.includes('express.static(path.join(__dirname, "public"))'),
  'static assets must be resolved relative to app.js'
);
assert(appSource.includes('require.main === module'), 'server startup must be guarded by require.main');
assert(appSource.includes('module.exports = app'), 'app.js must export the Express app for tests');
assert(!appSource.includes('module.exports = server'), 'app.js must not export a live server instance');
assert(!specSource.includes('server.close()'), 'tests should not depend on closing a require-cached server');
assert(specSource.includes("require('node:test')"), 'tests must use the built-in Node.js test runner');
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
assert(specSource.includes(".expect('Permissions-Policy', policy)"), 'tests must assert Permissions-Policy responses');
const permissionsPolicyTest = specSource
  .split('async function testPermissionsPolicy()', 2)[1]
  .split('\n  });', 1)[0];
assert(permissionsPolicyTest.includes(".get('/')"), 'Permissions-Policy tests must cover routed pages');
assert(permissionsPolicyTest.includes(".get('/static/css/main.less')"), 'Permissions-Policy tests must cover static assets');
assert(specSource.includes('Content-Security-Policy'), 'tests must assert content security policy on routed pages');
assert(specSource.includes("script-src 'self' https://cdnjs.cloudflare.com https://code.jquery.com https://maxcdn.bootstrapcdn.com"), 'tests must assert the CSP script directive without unsafe-inline');
assert(specSource.includes("frame-src https://www.openstreetmap.org"), 'tests must assert the CSP frame directive');
assert(specSource.includes("form-action 'self'"), 'tests must assert the CSP form-action directive');
assert(specSource.includes('renders accessible image alternatives and document metadata'), 'tests must cover rendered image alternatives and document metadata');
assert(!templateSource.includes('access_token=pk.'), 'templates must not embed Mapbox access tokens');
assert(templateSource.includes('openstreetmap.org/export/embed.html'), 'wedding-day map must use a tokenless map embed');
assert(templateSource.includes('title="Park City wedding map"'), 'map iframe must have a descriptive title');
assert(templateSource.includes('referrerpolicy="no-referrer-when-downgrade"'), 'map iframe must bound referrer disclosure');
assert(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(templateSource), 'templates must not contain inline script blocks');
assert(!templateSource.includes('google-analytics.com'), 'templates must not load Google Analytics');
assert(!templateSource.includes('widget.zola.com'), 'templates must not load the Zola widget script');
assert(templateSource.includes('src="/static/js/less.js"'), 'templates must use the checked-in Less compiler');
assert(templateSource.includes('src="/static/js/site.js"'), 'templates must load local site initialization');
assert(activeTemplateSource.includes('<html lang="en">'), 'templates must declare the document language');
assert(activeTemplateSource.includes('<meta name="viewport" content="width=device-width, initial-scale=1">'), 'templates must include mobile viewport metadata');
const imageTags = activeTemplateSource.match(/<img\b[^>]*>/gi) || [];
assert(imageTags.length === 11, 'templates must contain the expected 11 active images');
assert(imageTags.every((imageTag) => /\balt=(['"])[\s\S]*?\1/i.test(imageTag)), 'every active image must have an alt attribute');
assert(imageTags.filter((imageTag) => /\balt=""/i.test(imageTag)).length === 6, 'redundant navigation graphics must use empty alternative text');
[
  'Kristine kissing Gareth on the cheek',
  'Kristine and Gareth sharing a dessert',
  'Kristine and Gareth raising drinks together',
  'Kristine and Gareth beside an I love you mural',
  'Kristine and Gareth on a city street'
].forEach((alternativeText) => {
  assert(activeTemplateSource.includes(`alt="${alternativeText}"`), `story photo must retain alternative text: ${alternativeText}`);
});
assert(siteScriptSource.includes("$('#fullpage').fullpage({"), 'local site script must initialize fullPage navigation');
assert(packageJson.engines.node === '>=20', 'package must require Node.js 20 or newer');
assert(packageJson.dependencies.express === '5.2.1', 'Express must use the current maintained release');
assert(packageJson.dependencies.helmet === '8.2.0', 'Helmet must use the current maintained release');
assert(packageJson.dependencies.nunjucks === '3.2.4', 'Nunjucks must replace abandoned Swig');
assert(!packageJson.dependencies.swig, 'Swig must not remain in runtime dependencies');
assert(!packageJson.devDependencies.mocha, 'tests must not retain the deprecated Mocha dependency tree');
assert(packageJson.devDependencies.supertest === '7.2.2', 'Supertest must be a current development dependency');
assert(packageJson.scripts.test === 'node --test spec.js', 'npm test must use the built-in Node.js test runner');
assert(!packageJson.overrides, 'dependency overrides must not outlive the removed Mocha tree');
assert(fs.existsSync(lockPath), 'npm installs must be reproducible through package-lock.json');
assert(workflowSource.includes('permissions:\n  contents: read'), 'CI permissions must be read-only');
assert(workflowSource.includes('concurrency:'), 'CI must define concurrency');
assert(workflowSource.includes('cancel-in-progress: true'), 'CI must cancel superseded runs');
assert(workflowSource.includes('runs-on: ubuntu-24.04'), 'CI must use a fixed Ubuntu runner');
assert(workflowSource.includes('node-version: [20, 22, 24]'), 'CI must cover Node.js 20, 22, and 24');
assert(workflowSource.includes('workflow_dispatch:'), 'CI must support manual verification');
assert(workflowSource.includes('npm ci --prefix app'), 'CI must install from the lockfile');
assert(workflowSource.includes('npm audit --prefix app'), 'CI must audit the dependency graph');
assert(workflowSource.includes('run: make check'), 'CI must run the repository verification gate');
assert(workflowSource.includes('actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10'), 'checkout must use an immutable revision');
assert(workflowSource.includes('actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e'), 'setup-node must use an immutable revision');
assert(!workflowSource.includes('ubuntu-latest'), 'CI must not use a floating Ubuntu runner');
const makefileSource = fs.readFileSync(path.join(root, 'Makefile'), 'utf8');
assert(makefileSource.includes('ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))'), 'Makefile must resolve the repository root');
assert(makefileSource.includes('"$(ROOT)/scripts/check_wedding_contracts.js"'), 'Makefile must use the rooted contract path');
assert(makefileSource.includes('--prefix "$(ROOT)/app"'), 'Makefile must use the rooted npm project path');

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
assertCompletedPlan(inlineScriptPlanPath, 'wedding inline script removal');
assertCompletedPlan(accessibilityPlanPath, 'wedding image accessibility');
assertCompletedPlan(deploymentRetirementPlanPath, 'wedding deployment credential retirement');
assertCompletedPlan(permissionsPolicyPlanPath, 'wedding permissions policy');

console.log('wedding contracts passed');
