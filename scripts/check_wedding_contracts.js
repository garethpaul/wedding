#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app', 'app.js');
const specPath = path.join(root, 'app', 'spec.js');
const planPath = path.join(root, 'docs', 'plans', '2026-06-08-wedding-express-hardening.md');
const appSource = fs.readFileSync(appPath, 'utf8');
const specSource = fs.readFileSync(specPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(!appSource.includes('res.send(200,'), 'Express routes must use res.status(200).send(...)');
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
assert(specSource.includes('/static/css/main.less'), 'tests must cover a static asset response');
assert(specSource.includes('Strict-Transport-Security'), 'tests must assert HSTS on static assets');
assert(fs.existsSync(planPath), 'wedding hardening plan must live under docs/plans');
assert(fs.readFileSync(planPath, 'utf8').includes('status: completed'), 'wedding hardening plan must be completed');

console.log('wedding contracts passed');
