const req = require('supertest');
const {app} = require('../lib/handlers');

describe('GET', () => {
  context('serveStaticFile', () => {
    it('should return static file', (done) => {
      req(app.serve.bind(app))
        .get('/index.html')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect(/<title>ToDo<\/title>/, done);
    });

    it('should return not found if file is not present', (done) => {
      req(app.serve.bind(app))
        .get('/random.html')
        .expect(404, done);
    });
  });
});
