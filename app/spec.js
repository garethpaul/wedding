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
      .get('/static/css/main.css')
      .expect('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200);
  });

  it('sets download protection headers on static assets', async function testDownloadOptions() {
    await request(app)
      .get('/static/css/main.css')
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

  it('denies unused browser capabilities', async function testPermissionsPolicy() {
    const policy = 'camera=(), geolocation=(), microphone=()';

    await request(app)
      .get('/')
      .expect('Permissions-Policy', policy)
      .expect(200);

    await request(app)
      .get('/static/css/main.css')
      .expect('Permissions-Policy', policy)
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
          "script-src 'self' https://cdnjs.cloudflare.com https://code.jquery.com https://maxcdn.bootstrapcdn.com",
          "style-src 'self' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com https://netdna.bootstrapcdn.com",
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

  it('serves precompiled site styles without a browser Less compiler', async function testPrecompiledStyles() {
    await request(app)
      .get('/')
      .expect(function assertCompiledStyleReferences(response) {
        if (!response.text.includes('href="/static/css/main.css"')) {
          throw new Error('layout must load the compiled stylesheet');
        }
        if (response.text.includes('main.less') || response.text.includes('/static/js/less.js')) {
          throw new Error('layout must not load browser-side Less assets');
        }
      })
      .expect(200);

    await request(app)
      .get('/static/css/main.css')
      .expect('Content-Type', /text\/css/)
      .expect(/source-sha256: [a-f0-9]{64}/)
      .expect(200);
  });

  it('serves local site initialization with security headers', async function testSiteScript() {
    await request(app)
      .get('/static/js/site.js')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(200);
  });

  it('pins every third-party CDN resource with subresource integrity', async function testCdnIntegrity() {
    const expectedResources = [
      ['https://netdna.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css', 'sha384-pdapHxIh7EYuwy6K7iE41uXVxGCXY0sAjBzaElYGJUrzwodck3Lx6IE2lA0rFREo'],
      ['https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.9.0/jquery.fullPage.min.css', 'sha384-7iwtIAfJcdmOE1v8ooJt9VseRUH/H1orBncarhY6Gc4DwFqdGMZmsKB3qL4W/uKW'],
      ['https://code.jquery.com/jquery-2.1.4.min.js', 'sha384-R4/ztc4ZlRqWjqIuvf6RX5yb/v90qNGx6fS48N0tRxiGkqveZETq72KgDVJCp2TC'],
      ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js', 'sha384-pPttEvTHTuUJ9L2kCoMnNqCRcaMPMVMsWVO+RLaaaYDmfSP5//dP6eKRusbPcqhZ'],
      ['https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.9.0/jquery.fullPage.min.js', 'sha384-hhNjiSNhqsiYAL+l31KyzcTGAYraOrVCwtxxKCi6Tq8Go3PMns99n1fJfcqFuGmq']
    ];

    await request(app)
      .get('/')
      .expect(function assertCdnIntegrity(response) {
        var externalTags = response.text.match(/<(?:link|script)\b[^>]+https:\/\/[^>]+>/gi) || [];
        if (externalTags.length !== expectedResources.length) {
          throw new Error('every external resource must be covered by the SRI allowlist');
        }
        expectedResources.forEach(function assertResource(resource) {
          var tag = externalTags.find(function findResource(candidate) {
            return candidate.includes(resource[0]);
          });
          if (!tag || !tag.includes('integrity="' + resource[1] + '"')) {
            throw new Error('missing expected integrity for ' + resource[0]);
          }
          if (!tag.includes('crossorigin="anonymous"')) {
            throw new Error('missing anonymous CORS mode for ' + resource[0]);
          }
        });
      })
      .expect(200);
  });

  it('uses HTTPS for every external visitor link', async function testExternalLinkSecurity() {
    for (const route of ['/accomodation', '/explore']) {
      await request(app)
        .get(route)
        .expect(function assertHttpsVisitorLinks(response) {
          const plaintextLinks = response.text.match(/href=(['"])http:\/\/[^'"]+\1/gi) || [];
          if (plaintextLinks.length !== 0) {
            throw new Error(`${route} must not render plaintext external links`);
          }
        })
        .expect(200);
    }
  });

  it('uses the canonical Sundial Lodge destination', async function testSundialDestination() {
    await request(app)
      .get('/accomodation')
      .expect(function assertSundialDestination(response) {
        if (!response.text.includes('href="https://www.sundiallodge.com/"')) {
          throw new Error('Sundial Lodge must use its current official destination');
        }
        if (response.text.includes('bookings.ihotelier.com/Sundial-Lodge')) {
          throw new Error('Sundial Lodge must not use the retired booking endpoint');
        }
      })
      .expect(200);
  });

  it('renders accessible image alternatives and document metadata', async function testAccessibilityMetadata() {
    await request(app)
      .get('/')
      .expect(function assertAccessibilityMetadata(response) {
        var activeMarkup = response.text.replace(/<!--[\s\S]*?-->/g, '');
        var imageTags = activeMarkup.match(/<img\b[^>]*>/gi) || [];
        var imagesWithoutAlt = imageTags.filter(function missingAlt(imageTag) {
          return !/\balt=(['"])[\s\S]*?\1/i.test(imageTag);
        });

        if (!/<html\s+lang="en">/i.test(activeMarkup)) {
          throw new Error('document language must be English');
        }
        if (!/<meta\s+name="viewport"\s+content="width=device-width, initial-scale=1">/i.test(activeMarkup)) {
          throw new Error('document must include mobile viewport metadata');
        }
        if (imageTags.length !== 11) {
          throw new Error('home page must render the expected 11 images');
        }
        if (imagesWithoutAlt.length !== 0) {
          throw new Error('every rendered image must have an alt attribute');
        }
        if (!activeMarkup.includes('alt="Kristine kissing Gareth on the cheek"')) {
          throw new Error('story photos must retain meaningful alternative text');
        }
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
