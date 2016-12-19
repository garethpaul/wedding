var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./app');
  });
  afterEach(function () {
    server.close();
  });

  // Check that main page loads
  it('responds to /', function testSlash(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  // Check that something 404s
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
