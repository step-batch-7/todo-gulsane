const {readFileSync, writeFileSync, existsSync, statSync} = require('fs');
const {config} = require('../config.js');
const {loadTemplate} = require('./viewTemplate');
const {ToDoListCollection} = require('./toDoListCollection.js');
const {UserCollection} = require('./userCollection');
const {UsersDataStore} = require('./usersDataStore');

const {USER_STORE, DATA_STORE} = config;

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

const addUser = function (req, res) {
  const userCollection = UserCollection.load(loadUserList());
  const userDetail = req.body;
  userDetail.SIDs = [];
  userCollection.addUser(userDetail);
  userCollection.save(userListWriter);
  const usersDataStore = new UsersDataStore(readFileSync, writeFileSync, DATA_STORE);
  usersDataStore.initialize();
  usersDataStore.updateUserData(userDetail.username, []);
  res.redirect('login.html');
};

const verifyUser = function (req, res) {
  const userCollection = UserCollection.load(loadUserList());
  const {username, password} = req.body;
  if (userCollection.verifyUser(username, password)) {
    const sessionId = new Date().getTime();
    const {sessionManager} = req.app.locals;
    sessionManager.addSession(username, sessionId);
    res.cookie('SID', sessionId);
    return res.redirect('home');
  }
  res.redirect('login.html');
};

const ensureLoggedIn = function (req, res, next) {
  const sessionId = req.cookies.SID;
  const {sessionManager} = req.app.locals;
  const username = sessionManager.getUsername(+sessionId);
  if (username) {
    const usersDataStore = new UsersDataStore(
      readFileSync, writeFileSync, DATA_STORE
    );
    usersDataStore.initialize();
    req.app.locals.usersDataStore = usersDataStore;
    req.username = username;
    return next();
  }
  res.redirect('login.html');
};

const serveHomePage = function (req, res) {
  const homePage = loadTemplate('home.html', {});
  res.send(homePage);
};

const serveLoginPage = function (req, res) {
  const loginPage = loadTemplate('login.html', {});
  res.send(loginPage);
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
  changeTaskText
};
