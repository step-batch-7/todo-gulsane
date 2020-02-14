const fs = require('fs');
const req = require('supertest');
const {app} = require('../lib/handlers');

describe('GET', () => {
  context('serveStaticFile', () => {
    it('should return static file', (done) => {
      req(app)
        .get('/index.html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(/<title>ToDo<\/title>/, done);
    });

    it('should return not found if file is not present', (done) => {
      req(app)
        .get('/random.html')
        .expect(404, done);
    });
  });

  context('serveToDoListCollection', () => {
    it('should return toDoLists', (done) => {
      req(app)
        .get('/toDoLists')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
  });
});

describe('POST', () => {
  beforeEach(() => {
    const sampleData = `[
      {"id":"tl-1","title":"Home Work","tasks":[
        {"id":"task-1","text":"Maths","hasDone":false},
        {"id":"task-2","text":"English","hasDone":false}
      ]},
      {"id":"tl-2","title":"Class Work","tasks":[]}
    ]`;
    fs.writeFileSync('./test/resources/toDoLists.json', sampleData);
  });

  afterEach(() => {
    fs.unlinkSync('./test/resources/toDoLists.json');
  });

  context('addToDoList', () => {
    it('should add toDoList and return teh added toDoList', (done) => {
      req(app)
        .post('/addToDoList')
        .set('Content-Type', 'application/json')
        .send('{"title":"Home Work"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
        .expect('{"id":"tl-3","title":"Home Work","tasks":[]}');
    });
  });

  context('deleteToDoList', () => {
    it('should delete toDoList', (done) => {
      req(app)
        .post('/deleteToDoList')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1"}')
        .expect(200, done);
    });
  });

  context('addTask', () => {
    it('should add task to the given toDoList', (done) => {
      req(app)
        .post('/addTask')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-2","text":"Maths"}')
        .expect(200, done)
        .expect('{"id":"task-1","text":"Maths","hasDone":false}');
    });
  });

  context('deleteTask', () => {
    it('should delete task from given toDoList', (done) => {
      req(app)
        .post('/deleteTask')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-2"}')
        .expect(200, done);
    });
  });

  context('toggleTaskStatus', () => {
    it('should toggle the task done status for given toDoList', (done) => {
      req(app)
        .post('/toggleTaskStatus')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-2"}')
        .expect(200, done);
    });
  });

  context('changeToDoListTitle', () => {
    it('should change the title of given toDoList', (done) => {
      req(app)
        .post('/changeToDoListTitle')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","newTitle":"Assignment"}')
        .expect(200, done);
    });
  });

  context('changeTaskText', () => {
    it('should change the text of given task', (done) => {
      req(app)
        .post('/changeTaskText')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-1","newText":"Assignment"}')
        .expect(200, done);
    });
  });
});
