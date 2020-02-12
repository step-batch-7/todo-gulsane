const fs = require('fs');
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

  context('serveToDoListCollection', () => {
    it('should return toDoLists', (done) => {
      req(app.serve.bind(app))
        .get('/toDoLists')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
  });
});

describe('NOT ALLOWED METHODS', () => {
  it('should return method not allowed if method is not available', (done) => {
    req(app.serve.bind(app))
      .put('/random.html')
      .expect(400, done);
  });
});

describe('POST', () => {
  context('addToDoList', () => {
    it('should add toDoList and return teh added toDoList', (done) => {
      req(app.serve.bind(app))
        .post('/addToDoList')
        .set('Content-Type', 'application/json')
        .send('{"title":"Home Work"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
        .expect('{"id":"tl-1","title":"Home Work","tasks":[]}');
    });
  });

  context('deleteToDoList', () => {
    before(() => {
      const sampleData = '[{"id":"tl-1","title":"Home Work","tasks":[]}]';
      fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
    });

    it('should add toDoList and return teh added toDoList', (done) => {
      req(app.serve.bind(app))
        .post('/deleteToDoList')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1"}')
        .expect(200, done);
    });
  });
});
