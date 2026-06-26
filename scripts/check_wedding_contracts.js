#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { activeHtml } = require('./html_contracts');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app', 'app.js');
const specPath = path.join(root, 'app', 'spec.js');
const packagePath = path.join(root, 'app', 'package.json');
const lockPath = path.join(root, 'app', 'package-lock.json');
const workflowPath = path.join(root, '.github', 'workflows', 'check.yml');
const codeqlWorkflowPath = path.join(root, '.github', 'workflows', 'codeql.yml');
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
const subresourceIntegrityPlanPath = path.join(root, 'docs', 'plans', '2026-06-13-wedding-cdn-subresource-integrity.md');
const precompiledLessPlanPath = path.join(root, 'docs', 'plans', '2026-06-13-precompiled-less-and-strict-style-csp.md');
const makeRootProtectionPlanPath = path.join(root, 'docs', 'plans', '2026-06-14-make-root-override-protection.md');
const localDevelopmentPlanPath = path.join(root, 'docs', 'plans', '2026-06-14-local-development-guide.md');
const makeAuthorityPlanPath = path.join(root, 'docs', 'plans', '2026-06-21-make-authority-isolation.md');
const repositoryStatusPlanPath = path.join(root, 'docs', 'plans', '2026-06-25-wedding-local-only-status.md');
const localDevelopmentGuidePath = path.join(root, 'LOCAL_DEVELOPMENT.md');
const templatesPath = path.join(root, 'app', 'public', 'templates');
const layoutPath = path.join(templatesPath, 'layout.html');
const lessSourcePath = path.join(root, 'app', 'public', 'css', 'main.less');
const compiledCssPath = path.join(root, 'app', 'public', 'css', 'main.css');
const browserLessPath = path.join(root, 'app', 'public', 'js', 'less.js');
const cssBuildScriptPath = path.join(root, 'scripts', 'build_wedding_css.js');
const appSource = fs.readFileSync(appPath, 'utf8');
const specSource = fs.readFileSync(specPath, 'utf8');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const packageLock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const workflowSource = fs.readFileSync(workflowPath, 'utf8');
const codeqlWorkflowSource = fs.existsSync(codeqlWorkflowPath) ? fs.readFileSync(codeqlWorkflowPath, 'utf8') : '';
const siteScriptSource = fs.readFileSync(siteScriptPath, 'utf8');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');
const lessSource = fs.readFileSync(lessSourcePath, 'utf8');
const compiledCssSource = fs.readFileSync(compiledCssPath, 'utf8');
const cssBuildScriptSource = fs.readFileSync(cssBuildScriptPath, 'utf8');
const templateSource = fs.readdirSync(templatesPath)
  .filter((fileName) => fileName.endsWith('.html'))
  .map((fileName) => fs.readFileSync(path.join(templatesPath, fileName), 'utf8'))
  .join('\n');
const activeTemplateSource = activeHtml(templateSource);
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
    fs.existsSync(path.join(root, trackedFile)) &&
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
assert(!scriptSources.includes('google-analytics'), 'CSP must not allow removed Google Analytics endpoints');
assert(!scriptSources.includes('widget.zola'), 'CSP must not allow removed Zola widget scripts');
const styleSources = appSource.split('styleSrc: [', 2)[1].split(']', 1)[0];
assert(styleSources.includes("'https://cdnjs.cloudflare.com'"), 'CSP style sources must allow the reviewed fullPage stylesheet');
assert(styleSources.includes("'https://maxcdn.bootstrapcdn.com'"), 'CSP style sources must preserve the reviewed Bootstrap origin');
assert(styleSources.includes("'https://netdna.bootstrapcdn.com'"), 'CSP style sources must preserve the reviewed Bootstrap stylesheet origin');
assert(!styleSources.includes("'unsafe-inline'"), 'CSP style sources must reject inline styles');
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
assert(specSource.includes('/static/css/main.css'), 'tests must cover the compiled static stylesheet');
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
assert(permissionsPolicyTest.includes(".get('/static/css/main.css')"), 'Permissions-Policy tests must cover compiled static assets');
assert(specSource.includes('Content-Security-Policy'), 'tests must assert content security policy on routed pages');
assert(specSource.includes('serves precompiled site styles without a browser Less compiler'), 'tests must cover precompiled styles without runtime Less');
assert(specSource.includes('pins every third-party CDN resource with subresource integrity'), 'tests must cover rendered CDN integrity metadata');
assert(specSource.includes("script-src 'self' https://cdnjs.cloudflare.com https://code.jquery.com https://maxcdn.bootstrapcdn.com"), 'tests must assert the CSP script directive without unsafe-inline');
assert(specSource.includes("style-src 'self' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com https://netdna.bootstrapcdn.com"), 'tests must assert the CSP style directive without unsafe-inline');
assert(specSource.includes("frame-src https://www.openstreetmap.org"), 'tests must assert the CSP frame directive');
assert(specSource.includes("form-action 'self'"), 'tests must assert the CSP form-action directive');
assert(specSource.includes('renders accessible image alternatives and document metadata'), 'tests must cover rendered image alternatives and document metadata');
assert(!templateSource.includes('access_token=pk.'), 'templates must not embed Mapbox access tokens');
assert(templateSource.includes('openstreetmap.org/export/embed.html'), 'wedding-day map must use a tokenless map embed');
assert(templateSource.includes('title="Park City wedding map"'), 'map iframe must have a descriptive title');
assert(templateSource.includes('referrerpolicy="no-referrer-when-downgrade"'), 'map iframe must bound referrer disclosure');
assert(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(templateSource), 'templates must not contain inline script blocks');
assert(!/<style\b/i.test(activeTemplateSource), 'templates must not contain inline style blocks');
assert(!/\sstyle\s*=/i.test(activeTemplateSource), 'templates must not contain inline style attributes');
assert(!templateSource.includes('google-analytics.com'), 'templates must not load Google Analytics');
assert(!templateSource.includes('widget.zola.com'), 'templates must not load the Zola widget script');
assert(layoutSource.includes('href="/static/css/main.css"'), 'layout must load the precompiled stylesheet');
assert(!layoutSource.includes('/static/css/main.less'), 'layout must not load Less source directly');
assert(!layoutSource.includes('/static/js/less.js'), 'layout must not load a browser Less compiler');
assert(!fs.existsSync(browserLessPath), 'browser Less compiler must be removed');
assert(templateSource.includes('src="/static/js/site.js"'), 'templates must load local site initialization');
const lessDigest = crypto.createHash('sha256').update(lessSource).digest('hex');
assert(compiledCssSource.startsWith(`/* source-sha256: ${lessDigest} */\n`), 'compiled CSS must match the current Less source digest');
assert(compiledCssSource.includes('.starter-template'), 'compiled CSS must contain the site stylesheet rules');
assert(!compiledCssSource.includes('sourceMappingURL='), 'compiled CSS must not include a source map reference');
assert(cssBuildScriptSource.includes('javascriptEnabled: false'), 'CSS build must disable Less JavaScript evaluation');
assert(cssBuildScriptSource.includes("createHash('sha256')"), 'CSS build must bind output to a source digest');
assert(cssBuildScriptSource.includes("'main.less'"), 'CSS build must read the tracked Less source');
assert(cssBuildScriptSource.includes("'main.css'"), 'CSS build must write the tracked CSS artifact');
const expectedCdnIntegrity = new Map([
  ['https://netdna.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css', 'sha384-pdapHxIh7EYuwy6K7iE41uXVxGCXY0sAjBzaElYGJUrzwodck3Lx6IE2lA0rFREo'],
  ['https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.9.0/jquery.fullPage.min.css', 'sha384-7iwtIAfJcdmOE1v8ooJt9VseRUH/H1orBncarhY6Gc4DwFqdGMZmsKB3qL4W/uKW'],
  ['https://code.jquery.com/jquery-2.1.4.min.js', 'sha384-R4/ztc4ZlRqWjqIuvf6RX5yb/v90qNGx6fS48N0tRxiGkqveZETq72KgDVJCp2TC'],
  ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js', 'sha384-pPttEvTHTuUJ9L2kCoMnNqCRcaMPMVMsWVO+RLaaaYDmfSP5//dP6eKRusbPcqhZ'],
  ['https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.9.0/jquery.fullPage.min.js', 'sha384-hhNjiSNhqsiYAL+l31KyzcTGAYraOrVCwtxxKCi6Tq8Go3PMns99n1fJfcqFuGmq']
]);
const externalResourceTags = activeTemplateSource.match(/<(?:link|script)\b[^>]+https:\/\/[^>]+>/gi) || [];
assert(externalResourceTags.length === expectedCdnIntegrity.size, 'templates must keep exactly the reviewed external CDN resources');
for (const [url, integrity] of expectedCdnIntegrity) {
  const matchingTags = externalResourceTags.filter((tag) => tag.includes(url));
  assert(matchingTags.length === 1, `CDN resource must appear exactly once: ${url}`);
  assert(matchingTags[0].includes(`integrity="${integrity}"`), `CDN resource must keep reviewed integrity: ${url}`);
  assert(matchingTags[0].includes('crossorigin="anonymous"'), `CDN resource must use anonymous CORS mode: ${url}`);
}
assert(externalResourceTags.every((tag) => /\bintegrity="sha384-[A-Za-z0-9+/]+={0,2}"/.test(tag)), 'every external CDN tag must use SHA-384 integrity');
assert(externalResourceTags.every((tag) => /\bcrossorigin="anonymous"/.test(tag)), 'every external CDN tag must use anonymous CORS mode');
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
assert(specSource.includes('uses HTTPS for every external visitor link'), 'tests must cover rendered visitor-link security');
assert(!/href\s*=\s*(['"])http:\/\//i.test(activeTemplateSource), 'public templates must not contain plaintext external links');
assert(packageJson.engines.node === '>=20', 'package must require Node.js 20 or newer');
assert(packageJson.dependencies.express === '5.2.1', 'Express must use the current maintained release');
assert(packageJson.dependencies.helmet === '8.2.0', 'Helmet must use the current maintained release');
assert(packageJson.dependencies.nunjucks === '3.2.4', 'Nunjucks must replace abandoned Swig');
assert(!packageJson.dependencies.swig, 'Swig must not remain in runtime dependencies');
assert(!packageJson.devDependencies.mocha, 'tests must not retain the deprecated Mocha dependency tree');
assert(packageJson.devDependencies.supertest === '7.2.2', 'Supertest must be a current development dependency');
assert(packageJson.devDependencies.less === '4.6.4', 'Less must be pinned exactly as a development dependency');
assert(packageJson.scripts.test === 'node --test spec.js ../scripts/html_contracts.test.js', 'npm test must use the built-in Node.js test runner');
assert(packageJson.scripts.build === 'node ../scripts/build_wedding_css.js', 'npm build must precompile the site stylesheet');
assert(!packageJson.overrides, 'dependency overrides must not outlive the removed Mocha tree');
assert(fs.existsSync(lockPath), 'npm installs must be reproducible through package-lock.json');
assert(packageLock.packages['node_modules/less'].version === '4.6.4', 'lockfile must pin Less 4.6.4');
assert(packageLock.packages['node_modules/form-data'].version === '4.0.6', 'lockfile must pin patched form-data 4.0.6');
assert(workflowSource.includes('permissions:\n  contents: read'), 'CI permissions must be read-only');
assert(workflowSource.includes('concurrency:'), 'CI must define concurrency');
assert(workflowSource.includes('cancel-in-progress: true'), 'CI must cancel superseded runs');
assert(workflowSource.includes('runs-on: ubuntu-24.04'), 'CI must use a fixed Ubuntu runner');
assert(workflowSource.includes('node-version: [20, 22, 24]'), 'CI must cover Node.js 20, 22, and 24');
assert(workflowSource.includes('workflow_dispatch:'), 'CI must support manual verification');
assert(workflowSource.includes('npm ci --prefix app'), 'CI must install from the lockfile');
assert(workflowSource.includes('npm audit --prefix app'), 'CI must audit the dependency graph');
assert(workflowSource.includes('run: /usr/bin/make check'), 'CI must run the repository verification gate through the system Make');
assert(workflowSource.includes('actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10'), 'checkout must use an immutable revision');
assert(workflowSource.includes('persist-credentials: false'), 'CI checkout must not persist credentials');
assert(workflowSource.includes('actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e'), 'setup-node must use an immutable revision');
assert(!workflowSource.includes('ubuntu-latest'), 'CI must not use a floating Ubuntu runner');
assert(codeqlWorkflowSource, 'CodeQL workflow must exist');
assert(codeqlWorkflowSource.includes('permissions:\n  contents: read\n  security-events: write'), 'CodeQL must use least-privilege upload permissions');
assert(codeqlWorkflowSource.includes('language: [actions, javascript-typescript]'), 'CodeQL must analyze actions and JavaScript');
assert(codeqlWorkflowSource.includes('build-mode: none'), 'CodeQL must use no-build analysis');
assert(codeqlWorkflowSource.includes('runs-on: ubuntu-24.04'), 'CodeQL must use a fixed Ubuntu runner');
assert(codeqlWorkflowSource.includes('timeout-minutes: 10'), 'CodeQL must keep a finite timeout');
assert(codeqlWorkflowSource.includes('workflow_dispatch:'), 'CodeQL must support manual dispatch');
assert(codeqlWorkflowSource.includes('schedule:'), 'CodeQL must run on a schedule');
assert(codeqlWorkflowSource.includes('persist-credentials: false'), 'CodeQL checkout must not persist credentials');
assert(codeqlWorkflowSource.includes('category: "/language:${{ matrix.language }}"'), 'CodeQL must preserve the legacy language category for alert reconciliation');
assert(!codeqlWorkflowSource.includes('pull_request_target'), 'CodeQL must not execute pull-request code with target-branch privileges');

function workflowActions(source) {
  return [...source.matchAll(/^\s*uses:\s*([^\s#]+)/gm)].map((match) => match[1]);
}

assert(
  JSON.stringify(workflowActions(workflowSource)) === JSON.stringify([
    'actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10',
    'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e'
  ]),
  'CI must use only the approved immutable actions'
);
assert(
  JSON.stringify(workflowActions(codeqlWorkflowSource)) === JSON.stringify([
    'actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10',
    'github/codeql-action/init@8aad20d150bbac5944a9f9d289da16a4b0d87c1e',
    'github/codeql-action/analyze@8aad20d150bbac5944a9f9d289da16a4b0d87c1e'
  ]),
  'CodeQL must use only the approved immutable actions'
);
assert(
  JSON.stringify(fs.readdirSync(path.join(root, '.github', 'workflows')).filter((fileName) => /\.ya?ml$/.test(fileName)).sort()) ===
    JSON.stringify(['check.yml', 'codeql.yml']),
  'workflow inventory must contain only Check and CodeQL'
);
const makefileSource = fs.readFileSync(path.join(root, 'Makefile'), 'utf8');
const makefileLines = new Set(makefileSource.split(/\r?\n/));
assert(makefileLines.has('NODE ?= node'), 'Makefile must preserve the Node command override');
assert(makefileLines.has('NPM ?= npm'), 'Makefile must preserve the npm command override');
assert(makefileLines.has('override NODE := $(value NODE)'), 'Makefile must freeze the literal Node value');
assert(makefileLines.has('override NPM := $(value NPM)'), 'Makefile must freeze the literal npm value');
assert(makefileLines.has('override SHELL := /bin/sh'), 'Makefile must protect the recipe shell');
assert(makefileLines.has('override MAKEFILES :='), 'Makefile must clear inherited startup files');
assert(makefileSource.includes('override ROOT := $(shell path='), 'Makefile must derive the canonical repository root');
assert(makefileSource.includes("'$(REPOSITORY_NODE_LITERAL)' '$(REPOSITORY_ROOT_LITERAL)/scripts/check_wedding_contracts.js'"), 'Makefile must use protected Node and contract paths');
assert(makefileSource.includes("'$(REPOSITORY_NPM_LITERAL)' --prefix '$(REPOSITORY_ROOT_LITERAL)/app' run build"), 'Makefile build must use the protected npm project path');
assert(makefileSource.includes("'$(REPOSITORY_ROOT_LITERAL)/scripts/test-makefile-root.sh'"), 'Makefile must run authority regressions');
const makeAuthorityHarnessSource = fs.readFileSync(path.join(root, 'scripts', 'test-makefile-root.sh'), 'utf8');
assert(makeAuthorityHarnessSource.includes('Make authority tests passed: 30 target/root/shell cases'), 'Make authority harness must cover all six public targets');
for (const contract of [
  '${tool_name}-environment-syntax',
  '${tool_name}-brace-environment-syntax',
  'MAKEFILE_LIST must not be overridden',
  'MAKEFILES must be empty',
  'both : and :: entries',
  'later-vars.mk',
  'later-shell.mk',
  'Skipping npm test',
  'Skipping CSS build',
  'PATH="$TEMP_ROOT:/usr/bin:/bin"',
  'MAKEFLAGS=-n',
  '--ignore-errors'
]) {
  assert(makeAuthorityHarnessSource.includes(contract), `Make authority harness must retain ${contract}`);
}
assert(makeAuthorityHarnessSource.includes('8 raw Make-syntax controls'), 'Make authority harness must reject parenthesized and braced Node/npm syntax');

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
assertCompletedPlan(subresourceIntegrityPlanPath, 'wedding CDN subresource integrity');
assertCompletedPlan(precompiledLessPlanPath, 'wedding precompiled Less');
assertCompletedPlan(makeRootProtectionPlanPath, 'wedding Make root override protection');
assertCompletedPlan(localDevelopmentPlanPath, 'wedding local development guide');
assertCompletedPlan(makeAuthorityPlanPath, 'wedding Make authority isolation');
assertCompletedPlan(repositoryStatusPlanPath, 'wedding local-only repository status');

function checkLocalDevelopmentGuide() {
  const guideSource = fs.readFileSync(localDevelopmentGuidePath, 'utf8').replace(/\s+/g, ' ');
  const readmeSource = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const visionSource = fs.readFileSync(path.join(root, 'VISION.md'), 'utf8');
  const changesSource = fs.readFileSync(path.join(root, 'CHANGES.md'), 'utf8');
  const contracts = [
    'Use Node.js 20 or newer',
    'GitHub Actions verifies Node.js 20, 22, and 24',
    'package and lockfile live under `app/`',
    'npm ci --prefix app',
    'npm --prefix app run build',
    'npm --prefix app test',
    'npm audit --prefix app',
    'make check',
    'npm --prefix app run build npm --prefix app test npm audit --prefix app make check',
    'app/public/css/main.less',
    'app/public/css/main.css',
    'Do not hand-edit generated CSS',
    'npm --prefix app start',
    'defaults to `8080`',
    '`http://localhost:8080/`',
    '`/song-requests`, and `/registry`',
    'remain usable with a keyboard',
    'The layout remains readable at narrow mobile and desktop widths',
    'Do not attach private guest data',
    'Local development and GitHub Actions do not deploy the site',
    'historical metadata, not an active deployment workflow',
    'Never restore the retired Travis credential archive',
  ];
  for (const contract of contracts) {
    assert(guideSource.includes(contract), `local development guide must include ${contract}`);
  }
  assert(readmeSource.includes('See `LOCAL_DEVELOPMENT.md`'), 'README must link the local development guide');
  assert(readmeSource.includes('docs/plans/2026-06-14-local-development-guide.md'), 'README must link the local development plan');
  assert(visionSource.includes('Keep reproducible local setup, generated CSS, browser smoke checks'), 'VISION must preserve local setup guidance');
  assert(changesSource.includes('reproducible local development guide'), 'CHANGES must record local development guidance');
}

function checkRepositoryStatus() {
  const repositoryStatus = 'The maintained repository is a historical, local-only site. It is not currently deployable from this tree.';
  for (const [label, source] of [
    ['README', fs.readFileSync(path.join(root, 'README.md'), 'utf8')],
    ['local development guide', fs.readFileSync(localDevelopmentGuidePath, 'utf8')],
    ['VISION', fs.readFileSync(path.join(root, 'VISION.md'), 'utf8')],
    ['SECURITY', fs.readFileSync(path.join(root, 'SECURITY.md'), 'utf8')],
  ]) {
    assert(source.replace(/\s+/g, ' ').includes(repositoryStatus), `${label} must state the local-only repository status`);
  }
  const visionSource = fs.readFileSync(path.join(root, 'VISION.md'), 'utf8').replace(/\s+/g, ' ');
  const changesSource = fs.readFileSync(path.join(root, 'CHANGES.md'), 'utf8');
  assert(visionSource.includes('historical App Engine metadata alone does not establish deployment readiness'), 'VISION must keep historical metadata separate from deployment readiness');
  assert(changesSource.includes('historical, local-only'), 'CHANGES must record the repository status decision');
}

const localDevelopmentGuideInvocation = ['checkLocalDevelopmentGuide', '();'].join('');
assert(fs.readFileSync(__filename, 'utf8').includes(localDevelopmentGuideInvocation), 'local development guide contract must run');
checkLocalDevelopmentGuide();

const repositoryStatusInvocation = ['checkRepositoryStatus', '();'].join('');
assert(fs.readFileSync(__filename, 'utf8').includes(repositoryStatusInvocation), 'repository status contract must run');
checkRepositoryStatus();

console.log('wedding contracts passed');
