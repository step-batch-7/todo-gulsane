const {readFileSync, writeFileSync, existsSync, statSync} = require('fs');
const {loadTemplate} = require('./viewTemplate');
const {ToDoListCollection} = require('./toDoListCollection.js');
const {UserCollection} = require('./userCollection');
const {USER_STORE} = require('../config.js').config;

const userListWriter = writeFileSync.bind(null, USER_STORE);

const doesFileExist = function (filePath) {
  const stat = existsSync(filePath) && statSync(filePath);
  return stat && stat.isFile();
};

const loadUserList = () => {
  if (!doesFileExist(USER_STORE)) {
    return [];
  }

  return JSON.parse(readFileSync(USER_STORE, 'utf8'));
};

const serveToDoListCollection = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const userData = usersDataStore.getUserData(req.username);
  const toDoListCollection = ToDoListCollection.load(userData);
  res.json(toDoListCollection.allToDoList);
};

const addToDoList = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const {username} = req;
  const userData = usersDataStore.getUserData(username);
  const toDoListCollection = ToDoListCollection.load(userData);
  const {title} = req.body;
  toDoListCollection.add(title);
  const lastToDoList = toDoListCollection.lastToDoList;
  usersDataStore.updateUserData(username, toDoListCollection.allToDoList);
  res.status(200).json(lastToDoList);
};

const deleteToDoList = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const {username} = req;
  const userData = usersDataStore.getUserData(username);
  const toDoListCollection = ToDoListCollection.load(userData);
  const {toDoListId} = req.body;
  const deletedToDoList = toDoListCollection.findToDoList(toDoListId);
  toDoListCollection.delete(toDoListId);
  usersDataStore.updateUserData(username, toDoListCollection.allToDoList);
  res.status(200).json(deletedToDoList);
};

const addTask = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const {username} = req;
  const userData = usersDataStore.getUserData(username);
  const toDoListCollection = ToDoListCollection.load(userData);
  const {toDoListId, text} = req.body;
  toDoListCollection.addTask(toDoListId, text);
  const task = toDoListCollection.getLastTask(toDoListId);
  usersDataStore.updateUserData(username, toDoListCollection.allToDoList);
  res.status(200).json(task);
};

const deleteTask = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const {username} = req;
  const userData = usersDataStore.getUserData(username);
  const toDoListCollection = ToDoListCollection.load(userData);
  const {toDoListId, taskId} = req.body;
  const toDoList = toDoListCollection.findToDoList(toDoListId);
  const deletedTask = toDoList.findTask(taskId);
  toDoListCollection.deleteTask(toDoListId, taskId);
  usersDataStore.updateUserData(username, toDoListCollection.allToDoList);
  res.status(200).json(deletedTask);
};

const toggleTaskStatus = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const {username} = req;
  const userData = usersDataStore.getUserData(username);
  const toDoListCollection = ToDoListCollection.load(userData);
  const {toDoListId, taskId} = req.body;
  toDoListCollection.toggleTaskStatus(toDoListId, taskId);
  usersDataStore.updateUserData(username, toDoListCollection.allToDoList);
  res.status(200).end();
};

const changeToDoListTitle = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const {username} = req;
  const userData = usersDataStore.getUserData(username);
  const toDoListCollection = ToDoListCollection.load(userData);
  const {toDoListId, newTitle} = req.body;
  toDoListCollection.changeToDoListTitle(toDoListId, newTitle);
  usersDataStore.updateUserData(username, toDoListCollection.allToDoList);
  res.status(200).end();
};

const changeTaskText = function (req, res) {
  const {usersDataStore} = req.app.locals;
  const {username} = req;
  const userData = usersDataStore.getUserData(username);
  const toDoListCollection = ToDoListCollection.load(userData);
  const {toDoListId, taskId, newText} = req.body;
  toDoListCollection.changeTaskText(toDoListId, taskId, newText);
  usersDataStore.updateUserData(username, toDoListCollection.allToDoList);
  res.status(200).end();
};

const serveHomePage = function (req, res) {
  const userCollection = UserCollection.load(loadUserList());
  const userFullName = userCollection.getUserFullName(req.username);
  const homePage = loadTemplate('home.html', {name: userFullName});
  res.status(200).send(homePage);
};

const serveLoginPage = function (req, res) {
  const loginMessage = req.app.locals.loginMessage;
  const message = loginMessage ? loginMessage : '';
  const loginPage = loadTemplate('login.html', {message});
  req.app.locals.loginMessage = '';
  res.status(200).send(loginPage);
};

const serveSignUpPage = function (req, res) {
  const signUpMessage = req.app.locals.signUpMessage;
  const message = signUpMessage ? signUpMessage : '';
  const signUpPage = loadTemplate('signUp.html', {message});
  req.app.locals.signUpMessage = '';
  res.status(200).send(signUpPage);
};

const checkUsername = function (req, res) {
  const userCollection = UserCollection.load(loadUserList());
  const {username} = req.body;
  const isAvailable = userCollection.isAvailable(username);
  res.status(200).json({isAvailable});
};

// eslint-disable-next-line max-statements
const addUser = function (req, res) {
  const userDetail = req.body;
  const userCollection = UserCollection.load(loadUserList());
  const {username} = userDetail;
  const isAvailable = userCollection.isAvailable(username);
  if (isAvailable) {
    userCollection.addUser(userDetail);
    userCollection.save(userListWriter);
    req.app.locals.usersDataStore.updateUserData(userDetail.username, []);
    return res.redirect('login.html');
  }
  req.app.locals.signUpMessage = 'username is not available';
  res.redirect('signUp.html');
};

// eslint-disable-next-line max-statements
const verifyUser = function (req, res) {
  const userCollection = UserCollection.load(loadUserList());
  const {username, password} = req.body;
  if (userCollection.verifyUser(username, password)) {
    const sessionId = new Date().getTime().toString();
    const {sessions} = req.app.locals;
    sessions.add(username, sessionId);
    res.cookie('SID', sessionId);
    return res.redirect('home');
  }
  req.app.locals.loginMessage = 'wrong username or password';
  res.redirect('login.html');
};

// eslint-disable-next-line max-statements
const ensureLoggedIn = function (req, res, next) {
  const sessionId = req.cookies.SID;
  const {sessions} = req.app.locals;
  const username = sessions.getUsername(sessionId);
  if (username) {
    req.username = username;
    return next();
  }
  res.redirect('login.html');
};

const handleLogout = function (req, res) {
  const sessionId = req.cookies.SID;
  const {sessions} = req.app.locals;
  sessions.remove(sessionId);
  res.clearCookie('SID');
  res.redirect('login.html');
};

module.exports = {
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
};
