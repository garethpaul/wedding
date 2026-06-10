const { describe, it } = require('node:test');
const request = require('supertest');
const app = require('./app');

describe('loading express', function () {
  [
    '/',
    '/our-story',
    '/the-big-day',
    '/accomodation',
    '/explore',
    '/song-requests',
    '/registry'
  ].forEach(function (route) {
    it('responds to ' + route, async function testRoute() {
      await request(app)
        .get(route)
        .expect(200);
    });
  });

  it('sets HSTS on static assets', async function testStaticHsts() {
    await request(app)
      .get('/static/css/main.less')
      .expect('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200);
  });

  it('sets download protection headers on static assets', async function testDownloadOptions() {
    await request(app)
      .get('/static/css/main.less')
      .expect('X-Download-Options', 'noopen')
      .expect(200);
  });

  it('sets clickjacking protection headers', async function testFrameguard() {
    await request(app)
      .get('/')
      .expect('X-Frame-Options', 'DENY')
      .expect(200);
  });

  it('disables the obsolete browser XSS auditor', async function testXssProtection() {
    await request(app)
      .get('/')
      .expect('X-XSS-Protection', '0')
      .expect('Cross-Origin-Opener-Policy', 'same-origin')
      .expect('Cross-Origin-Resource-Policy', 'same-origin')
      .expect(200);
  });

  it('disables DNS prefetching', async function testDnsPrefetchControl() {
    await request(app)
      .get('/')
      .expect('X-DNS-Prefetch-Control', 'off')
      .expect(200);
  });

  it('sets a restrictive referrer policy', async function testReferrerPolicy() {
    await request(app)
      .get('/')
      .expect('Referrer-Policy', 'no-referrer')
      .expect(200);
  });

  it('sets a content security policy for page assets', async function testContentSecurityPolicy() {
    await request(app)
      .get('/')
      .expect(function assertContentSecurityPolicy(response) {
        var policy = response.headers['content-security-policy'];
        if (!policy) {
          throw new Error('Content-Security-Policy must be set');
        }
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://code.jquery.com https://maxcdn.bootstrapcdn.com https://www.google-analytics.com https://widget.zola.com",
          "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com https://netdna.bootstrapcdn.com",
          "frame-src https://www.openstreetmap.org",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].forEach(function assertDirective(directive) {
          if (policy.indexOf(directive) === -1) {
            throw new Error('Content-Security-Policy missing ' + directive);
          }
        });
      })
      .expect(200);
  });

  it('does not expose Express implementation headers', async function testPoweredBy() {
    await request(app)
      .get('/')
      .expect(function assertNoPoweredBy(response) {
        if (response.headers['x-powered-by']) {
          throw new Error('X-Powered-By must not be set');
        }
      })
      .expect(200);
  });

  // Check that something 404s
  it('404 everything else', async function testPath() {
    await request(app)
      .get('/foo/bar')
      .expect(404);
  });
});
