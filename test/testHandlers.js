const fs = require('fs');
const req = require('supertest');
const sinon = require('sinon');
const {app} = require('../lib/routes');

const mockSessions = () => ({
  getUsername: (SID) => SID === '1234' ? 'john' : undefined,
  add: sinon.mock().returns(),
  remove: sinon.mock().returns(true)
});

const todoLists = [{
  name: 'Home Work',
  tasks: [{id: 'task-1', name: 'Math', status: false}],
  id: 'tl-1'
}];

const mockUsersDataStore = () => ({
  getUserData: sinon.mock().returns(todoLists),
  updateUserData: sinon.mock().returns()
});

describe('GET', () => {
  context('should serve public files', () => {
    it('should return static file', (done) => {
      req(app)
        .get('/css/style.css')
        .expect(200, done)
        .expect('Content-Type', /text\/css/);
    });

    it('should return login page', (done) => {
      req(app)
        .get('/login.html')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect(/<title>Login<\/title>/, done);
    });

    it('should return signUp page', (done) => {
      req(app)
        .get('/signUp.html')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect(/<title>SignUp<\/title>/, done);
    });

    it('should redirect to home if / asked', (done) => {
      req(app)
        .get('/')
        .expect(302, done)
        .expect('location', 'home');
    });
  });

  context('should serve public files', () => {
    beforeEach(() => {
      app.locals.sessions = mockSessions();
      app.locals.usersDataStore = mockUsersDataStore();
      const userList = [{name: 'john khan', username: 'john', password: '1234'}];
      fs.writeFileSync('./test/resources/userList.json', JSON.stringify(userList));
    });

    afterEach(() => {
      fs.unlinkSync('./test/resources/userList.json');
    });

    it('should redirect to login page if cookie is not set or SID not matched', (done) => {
      req(app)
        .get('/home')
        .expect(302, done)
        .expect('location', 'login.html');
    });

    it('should return home page if SID is matched to user', (done) => {
      req(app)
        .get('/home')
        .set('Cookie', 'SID=1234')
        .expect(200)
        .expect('Content-Type', /text\/html/)
        .expect(/<title>ToDo<\/title>/, done);
    });

    it('should return todoLists for given SID', (done) => {
      req(app)
        .get('/todoLists')
        .set('Cookie', 'SID=1234')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .expect(/\[.*\]/, done);
    });

    it('should redirect to login page for /logout', (done) => {
      req(app)
        .get('/logout')
        .set('Cookie', 'SID=1234')
        .expect(302, done)
        .expect('location', 'login.html');
    });
  });
});

describe('POST', function () {
  context('addUser if userList file does not exist', () => {
    app.locals.sessions = mockSessions();
    app.locals.usersDataStore = mockUsersDataStore();
    it('should add the user add redirect to login.html', (done) => {
      req(app)
        .post('/signup')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('name=Johnny Khan&username=johnny&password=1234')
        .expect(302, done)
        .expect('location', 'login.html');
    });
  });
});

describe('POST', () => {
  beforeEach(() => {
    app.locals.sessions = mockSessions();
    app.locals.usersDataStore = mockUsersDataStore();
    const userList = [{name: 'john khan', username: 'john', password: '1234'}];
    fs.writeFileSync('./test/resources/userList.json', JSON.stringify(userList));
  });

  afterEach(() => {
    fs.unlinkSync('./test/resources/userList.json');
  });

  context('/checkUsername', () => {
    it('should return true if user is available', (done) => {
      req(app)
        .post('/checkUsername')
        .set('Content-Type', 'application/json')
        .send('{"username":"johnny"}')
        .expect(200, done)
        .expect('Content-Type', /application\/json/)
        .expect('{"isAvailable":true}');
    });

    it('should return false if user is not available', (done) => {
      req(app)
        .post('/checkUsername')
        .set('Content-Type', 'application/json')
        .send('{"username":"john"}')
        .expect(200, done)
        .expect('Content-Type', /application\/json/)
        .expect('{"isAvailable":false}');
    });

    it('should return bad request if username field is not given', (done) => {
      req(app)
        .post('/checkUsername')
        .set('Content-Type', 'application/json')
        .send('{"usernames":"john"}')
        .expect(400, done);
    });
  });

  context('/signup', () => {
    it('should redirect back to signup page if user is not available', (done) => {
      req(app)
        .post('/signup')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('name=John Khan&username=john&password=1234')
        .expect(302, done)
        .expect('location', 'signUp.html');
    });
  });

  context('/login', () => {
    it('should redirect to home page if user info is valid', (done) => {
      req(app)
        .post('/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('&username=john&password=1234')
        .expect(302, done)
        .expect('location', 'home');
    });

    it('should redirect back to login.html if password is wrong', (done) => {
      req(app)
        .post('/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('username=john&password=123')
        .expect(302, done)
        .expect('location', 'login.html');
    });

    it('should redirect back to login.html if username is wrong', (done) => {
      req(app)
        .post('/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('username=johnny&password=1234')
        .expect(302, done)
        .expect('location', 'login.html');
    });
  });

  context('addToDoList', () => {
    it('should add toDoList and return the added toDoList', (done) => {
      req(app)
        .post('/addToDoList')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"title":"Class Work"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect('{"id":"tl-2","title":"Class Work","tasks":[]}');
    });

    it('should return bad request if title field is not given', (done) => {
      req(app)
        .post('/addToDoList')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"tt":"Home Work"}')
        .expect(400, done);
    });
  });

  context('deleteToDoList', () => {
    it('should delete toDoList', (done) => {
      req(app)
        .post('/deleteToDoList')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1"}')
        .expect(200, done);
    });

    it('should return bad request if toDoListId field is not given', (done) => {
      req(app)
        .post('/deleteToDoList')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"tt":"tl-1"}')
        .expect(400, done);
    });
  });

  context('addTask', () => {
    it('should add task to the given toDoList', (done) => {
      req(app)
        .post('/addTask')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","text":"English"}')
        .expect(200, done)
        .expect('{"id":"task-2","text":"English","hasDone":false}');
    });

    it('should return bad request if any of required fields is not given', (done) => {
      req(app)
        .post('/addTask')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'SID=1234')
        .send('{"toDoListsId":"tl-1","texts":"English"}')
        .expect(400, done);
    });
  });

  context('deleteTask', () => {
    it('should delete task from given toDoList', (done) => {
      req(app)
        .post('/deleteTask')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-1"}')
        .expect(200, done);
    });

    it('should return bad request if any of required fields is not given', (done) => {
      req(app)
        .post('/deleteTask')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'SID=1234')
        .send('{"toDoListsId":"tl-1","taskId":"task-1"}')
        .expect(400, done);
    });
  });

  context('toggleTaskStatus', () => {
    it('should toggle the task done status for given toDoList', (done) => {
      req(app)
        .post('/toggleTaskStatus')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-1"}')
        .expect(200, done);
    });

    it('should return bad request if any of required fields is not given', (done) => {
      req(app)
        .post('/toggleTaskStatus')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'SID=1234')
        .send('{"toDoListId":"tl-1","tasksId":"task-1"}')
        .expect(400, done);
    });
  });

  context('changeToDoListTitle', () => {
    it('should change the title of given toDoList', (done) => {
      req(app)
        .post('/changeToDoListTitle')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","newTitle":"Assignment"}')
        .expect(200, done);
    });

    it('should return bad request if any of required fields is not given', (done) => {
      req(app)
        .post('/changeToDoListTitle')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'SID=1234')
        .send('{"toDoListId":"tl-1","title":"Assignment"}')
        .expect(400, done);
    });
  });

  context('changeTaskText', () => {
    it('should change the text of given task', (done) => {
      req(app)
        .post('/changeTaskText')
        .set('Cookie', 'SID=1234')
        .set('Content-Type', 'application/json')
        .send('{"toDoListId":"tl-1","taskId":"task-1","newText":"Assignment"}')
        .expect(200, done);
    });

    it('should return bad request if any of required fields is not given', (done) => {
      req(app)
        .post('/changeTaskText')
        .set('Content-Type', 'application/json')
        .set('Cookie', 'SID=1234')
        .send('{"toDoListId":"tl-1","taskId":"task-1","text":"Assignment"}')
        .expect(400, done);
    });
  });
});
