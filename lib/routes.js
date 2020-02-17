const express = require('express');
const cookieParser = require('cookie-parser');
const {SessionManager} = require('./sessionManager');

const {
  addUser,
  verifyUser,
  ensureLoggedIn,
  serveHomePage,
  serveLoginPage,
  serveToDoListCollection,
  addToDoList,
  deleteToDoList,
  addTask,
  deleteTask,
  toggleTaskStatus,
  changeToDoListTitle,
  changeTaskText,
  handleLogout,
  checkUsername,
  serveSignUpPage
} = require('./handlers');

const app = express();
app.locals.sessionManager = new SessionManager();

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.post('/checkUsername', checkUsername);
app.post('/signUp', addUser);
app.post('/login', verifyUser);
app.get('/logout', handleLogout);
app.get('/signUp.html', serveSignUpPage);
app.get('/login.html', serveLoginPage);
app.use(express.static('public'));
app.use(ensureLoggedIn);
app.get('/home', serveHomePage);
app.get('/', (req, res) => res.redirect('home'));
app.get('/toDoLists', serveToDoListCollection);
app.post('/addToDoList', addToDoList);
app.post('/deleteToDoList', deleteToDoList);
app.post('/addTask', addTask);
app.post('/deleteTask', deleteTask);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/changeToDoListTitle', changeToDoListTitle);
app.post('/changeTaskText', changeTaskText);

module.exports = {app};
