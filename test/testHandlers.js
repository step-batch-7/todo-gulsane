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
  afterEach(() => {
    fs.unlinkSync('./test/resources/toDoLists.json');
  });

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
      const sampleData = `[
        {"id":"tl-1","title":"Home Work","tasks":[]},
        {"id":"tl-2","title":"Class Work","tasks":[]}
      ]`;
      fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
    });

    it('should delete toDoList', (done) => {
      req(app.serve.bind(app))
        .post('/deleteToDoList')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1"}')
        .expect(200, done);
    });
  });

  context('addTask', () => {
    before(() => {
      const sampleData = `[
        {"id":"tl-1","title":"Home Work","tasks":[]},
        {"id":"tl-2","title":"Class Work","tasks":[]}
      ]`;
      fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
    });

    it('should add task to the given toDoList', (done) => {
      req(app.serve.bind(app))
        .post('/addTask')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","text":"Maths"}')
        .expect(200, done)
        .expect('{"id":"task-1","text":"Maths","hasDone":false}');
    });
  });

  context('deleteTask', () => {
    before(() => {
      const sampleData = `[
        {"id":"tl-1","title":"Home Work","tasks":[
          {"id":"task-1","text":"Maths","hasDone":false},
          {"id":"task-2","text":"English","hasDone":false}
        ]},
        {"id":"tl-2","title":"Class Work","tasks":[]}
      ]`;
      fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
    });

    it('should delete task from given toDoList', (done) => {
      req(app.serve.bind(app))
        .post('/deleteTask')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-2"}')
        .expect(200, done);
    });
  });

  context('toggleTaskStatus', () => {
    before(() => {
      const sampleData = `[
        {"id":"tl-1","title":"Home Work","tasks":[
          {"id":"task-1","text":"Maths","hasDone":false},
          {"id":"task-2","text":"English","hasDone":false}
        ]},
        {"id":"tl-2","title":"Class Work","tasks":[]}
      ]`;
      fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
    });

    it('should toggle the task done status for given toDoList', (done) => {
      req(app.serve.bind(app))
        .post('/toggleTaskStatus')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-2"}')
        .expect(200, done);
    });
  });

  context('changeToDoListTitle', () => {
    before(() => {
      const sampleData = `[
        {"id":"tl-1","title":"Home Work","tasks":[
          {"id":"task-1","text":"Maths","hasDone":false},
          {"id":"task-2","text":"English","hasDone":false}
        ]},
        {"id":"tl-2","title":"Class Work","tasks":[]}
      ]`;
      fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
    });

    it('should change the title of given toDoList', (done) => {
      req(app.serve.bind(app))
        .post('/changeToDoListTitle')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","newTitle":"Assignment"}')
        .expect(200, done);
    });
  });

  context('changeTaskText', () => {
    before(() => {
      const sampleData = `[
        {"id":"tl-1","title":"Home Work","tasks":[
          {"id":"task-1","text":"Maths","hasDone":false},
          {"id":"task-2","text":"English","hasDone":false}
        ]},
        {"id":"tl-2","title":"Class Work","tasks":[]}
      ]`;
      fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
    });

    it('should change the text of given task', (done) => {
      req(app.serve.bind(app))
        .post('/changeTaskText')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-1","newText":"Assignment"}')
        .expect(200, done);
    });
  });
});
