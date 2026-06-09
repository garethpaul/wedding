var request = require('supertest');
var app = require('./app');

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
    it('responds to ' + route, function testRoute(done) {
      request(app)
        .get(route)
        .expect(200, done);
    });
  });

  it('sets HSTS on static assets', function testStaticHsts(done) {
    request(app)
      .get('/static/css/main.less')
      .expect('Strict-Transport-Security', /max-age=/)
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200, done);
  });

  it('sets download protection headers on static assets', function testDownloadOptions(done) {
    request(app)
      .get('/static/css/main.less')
      .expect('X-Download-Options', 'noopen')
      .expect(200, done);
  });

  it('sets clickjacking protection headers', function testFrameguard(done) {
    request(app)
      .get('/')
      .expect('X-Frame-Options', 'DENY')
      .expect(200, done);
  });

  it('sets legacy XSS protection headers', function testXssProtection(done) {
    request(app)
      .get('/')
      .expect('X-XSS-Protection', '1; mode=block')
      .expect(200, done);
  });

  it('disables DNS prefetching', function testDnsPrefetchControl(done) {
    request(app)
      .get('/')
      .expect('X-DNS-Prefetch-Control', 'off')
      .expect(200, done);
  });

  it('sets a restrictive referrer policy', function testReferrerPolicy(done) {
    request(app)
      .get('/')
      .expect('Referrer-Policy', 'no-referrer')
      .expect(200, done);
  });

  it('sets a content security policy for page assets', function testContentSecurityPolicy(done) {
    request(app)
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
      .expect(200, done);
  });

  it('does not expose Express implementation headers', function testPoweredBy(done) {
    request(app)
      .get('/')
      .expect(function assertNoPoweredBy(response) {
        if (response.headers['x-powered-by']) {
          throw new Error('X-Powered-By must not be set');
        }
      })
      .expect(200, done);
  });

  // Check that something 404s
  it('404 everything else', function testPath(done) {
    request(app)
      .get('/foo/bar')
      .expect(404, done);
  });
});
