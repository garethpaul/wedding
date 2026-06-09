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

  it('sets clickjacking protection headers', function testFrameguard(done) {
    request(app)
      .get('/')
      .expect('X-Frame-Options', 'DENY')
      .expect(200, done);
  });

  it('sets a restrictive referrer policy', function testReferrerPolicy(done) {
    request(app)
      .get('/')
      .expect('Referrer-Policy', 'no-referrer')
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
