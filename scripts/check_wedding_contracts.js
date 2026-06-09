#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app', 'app.js');
const specPath = path.join(root, 'app', 'spec.js');
const expressPlanPath = path.join(root, 'docs', 'plans', '2026-06-08-wedding-express-hardening.md');
const mapPlanPath = path.join(root, 'docs', 'plans', '2026-06-08-wedding-tokenless-map.md');
const poweredByPlanPath = path.join(root, 'docs', 'plans', '2026-06-08-wedding-powered-by-header.md');
const browserHeadersPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-browser-headers.md');
const referrerPolicyPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-referrer-policy.md');
const downloadOptionsPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-download-options.md');
const xssProtectionPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-xss-protection.md');
const dnsPrefetchPlanPath = path.join(root, 'docs', 'plans', '2026-06-09-wedding-dns-prefetch-control.md');
const templatesPath = path.join(root, 'app', 'public', 'templates');
const appSource = fs.readFileSync(appPath, 'utf8');
const specSource = fs.readFileSync(specPath, 'utf8');
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
assert(appSource.includes("app.use(helmet.frameguard({ action: 'deny' }))"), 'Express must enable frameguard');
assert(appSource.includes('app.use(helmet.noSniff())'), 'Express must enable no-sniff headers');
assert(appSource.includes('app.use(helmet.ieNoOpen())'), 'Express must enable download protection headers');
assert(appSource.includes('app.use(helmet.xssFilter())'), 'Express must enable legacy XSS protection headers');
assert(appSource.includes('app.use(helmet.dnsPrefetchControl())'), 'Express must disable DNS prefetching');
assert(appSource.includes("app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))"), 'Express must enable a no-referrer policy');
assert(appSource.indexOf('app.use(helmet.frameguard') < appSource.indexOf("app.use('/static'"), 'frameguard must run before static assets');
assert(appSource.indexOf('app.use(helmet.noSniff') < appSource.indexOf("app.use('/static'"), 'no-sniff must run before static assets');
assert(appSource.indexOf('app.use(helmet.ieNoOpen') < appSource.indexOf("app.use('/static'"), 'download protection must run before static assets');
assert(appSource.indexOf('app.use(helmet.xssFilter') < appSource.indexOf("app.use('/static'"), 'XSS protection must run before static assets');
assert(appSource.indexOf('app.use(helmet.dnsPrefetchControl') < appSource.indexOf("app.use('/static'"), 'DNS prefetch control must run before static assets');
assert(appSource.indexOf('app.use(helmet.referrerPolicy') < appSource.indexOf("app.use('/static'"), 'referrer policy must run before static assets');
assert(appSource.indexOf('app.use(helmet.hsts') < appSource.indexOf("app.use('/static'"), 'helmet middleware must run before static assets');
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
assert(specSource.includes('X-Content-Type-Options'), 'tests must assert no-sniff on static assets');
assert(specSource.includes('X-Download-Options'), 'tests must assert download protection on static assets');
assert(specSource.includes('X-XSS-Protection'), 'tests must assert legacy XSS protection on routed pages');
assert(specSource.includes('X-DNS-Prefetch-Control'), 'tests must assert DNS prefetch control on routed pages');
assert(specSource.includes('X-Frame-Options'), 'tests must assert frameguard on routed pages');
assert(specSource.includes('Referrer-Policy'), 'tests must assert referrer policy on routed pages');
assert(!templateSource.includes('access_token=pk.'), 'templates must not embed Mapbox access tokens');
assert(templateSource.includes('openstreetmap.org/export/embed.html'), 'wedding-day map must use a tokenless map embed');
assert(templateSource.includes('title="Park City wedding map"'), 'map iframe must have a descriptive title');
assert(templateSource.includes('referrerpolicy="no-referrer-when-downgrade"'), 'map iframe must bound referrer disclosure');

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

console.log('wedding contracts passed');
