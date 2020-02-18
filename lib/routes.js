const {readFileSync, writeFileSync} = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const {Sessions} = require('./sessions');
const {UsersDataStore} = require('./usersDataStore');
const {DATA_STORE} = require('../config').config;

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
  serveSignUpPage,
  hasFields
} = require('./handlers');

const usersDataStore = new UsersDataStore(
  readFileSync, writeFileSync, DATA_STORE
);
usersDataStore.initialize();

const app = express();
app.locals.sessions = new Sessions();
app.locals.usersDataStore = usersDataStore;

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => res.redirect('home'));
app.post('/checkUsername', hasFields('username'), checkUsername);
app.post('/signUp', addUser);
app.post('/login', verifyUser);
app.get('/logout', handleLogout);
app.get('/signUp.html', serveSignUpPage);
app.get('/login.html', serveLoginPage);
app.use(express.static('public'));
app.use(ensureLoggedIn);
app.get('/home', serveHomePage);
app.get('/toDoLists', serveToDoListCollection);
app.post('/addToDoList', hasFields('title'), addToDoList);
app.post('/deleteToDoList', hasFields('toDoListId'), deleteToDoList);
app.post('/addTask', hasFields('toDoListId', 'text'), addTask);
app.post('/deleteTask', hasFields('toDoListId', 'taskId'), deleteTask);
app.post('/toggleTaskStatus', hasFields('toDoListId', 'taskId'), toggleTaskStatus);
app.post('/changeToDoListTitle', hasFields('toDoListId', 'newTitle'), changeToDoListTitle);
app.post('/changeTaskText', hasFields('toDoListId', 'taskId', 'newText'), changeTaskText);

module.exports = {app};
