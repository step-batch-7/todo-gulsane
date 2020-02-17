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
  serveSignUpPage
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
app.post('/checkUsername', checkUsername);
app.post('/signUp', addUser);
app.post('/login', verifyUser);
app.get('/logout', handleLogout);
app.get('/signUp.html', serveSignUpPage);
app.get('/login.html', serveLoginPage);
app.use(express.static('public'));
app.use(ensureLoggedIn);
app.get('/home', serveHomePage);
app.get('/toDoLists', serveToDoListCollection);
app.post('/addToDoList', addToDoList);
app.post('/deleteToDoList', deleteToDoList);
app.post('/addTask', addTask);
app.post('/deleteTask', deleteTask);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/changeToDoListTitle', changeToDoListTitle);
app.post('/changeTaskText', changeTaskText);

module.exports = {app};
