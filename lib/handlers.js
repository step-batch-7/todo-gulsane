const fs = require('fs');
const express = require('express');
const {config} = require('../config.js');
const {ToDoListCollection} = require('./toDoListCollection.js');
const {UserCollection} = require('./userCollection');

const app = express();

const userListWriter = fs.writeFileSync.bind(null, config.USER_STORE);

const doesFileExist = function (filePath) {
  const stat = fs.existsSync(filePath) && fs.statSync(filePath);
  return stat && stat.isFile();
};

const loadToDoLists = () => {
  if (!doesFileExist(config.DATA_STORE)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(config.DATA_STORE, 'utf8'));
};

const loadUserList = () => {
  if (!doesFileExist(config.USER_STORE)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(config.USER_STORE, 'utf8'));
};

const writeDataFile = function (toDoListCollection) {
  fs.writeFileSync(config.DATA_STORE, toDoListCollection.toJSON());
};

const serveToDoListCollection = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  res.json(toDoListCollection.allToDoList);
};

const addToDoList = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {title} = req.body;
  toDoListCollection.add(title);
  const lastToDoList = toDoListCollection.lastToDoList;
  writeDataFile(toDoListCollection);
  res.status(200).json(lastToDoList);
};

const deleteToDoList = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId} = req.body;
  const deletedToDoList = toDoListCollection.findToDoList(toDoListId);
  toDoListCollection.delete(toDoListId);
  writeDataFile(toDoListCollection);
  res.status(200).json(deletedToDoList);
};

const addTask = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, text} = req.body;
  toDoListCollection.addTask(toDoListId, text);
  const task = toDoListCollection.getLastTask(toDoListId);
  writeDataFile(toDoListCollection);
  res.status(200).json(task);
};

const deleteTask = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, taskId} = req.body;
  const toDoList = toDoListCollection.findToDoList(toDoListId);
  const deletedTask = toDoList.findTask(taskId);
  toDoListCollection.deleteTask(toDoListId, taskId);
  writeDataFile(toDoListCollection);
  res.status(200).json(deletedTask);
};

const toggleTaskStatus = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, taskId} = req.body;
  toDoListCollection.toggleTaskStatus(toDoListId, taskId);
  writeDataFile(toDoListCollection);
  res.status(200).end();
};

const changeToDoListTitle = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, newTitle} = req.body;
  toDoListCollection.changeToDoListTitle(toDoListId, newTitle);
  writeDataFile(toDoListCollection);
  res.status(200).end();
};

const changeTaskText = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, taskId, newText} = req.body;
  toDoListCollection.changeTaskText(toDoListId, taskId, newText);
  writeDataFile(toDoListCollection);
  res.status(200).end();
};

const addUser = function (req, res) {
  const userCollection = UserCollection.load(loadUserList());
  const userDetail = req.body;
  userCollection.addUser(userDetail);
  userCollection.save(userListWriter);
  res.status(200).end();
};

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));
app.post('/signup', addUser);
app.get('/', (req, res) => res.redirect('index.html'));
app.get('/toDoLists', serveToDoListCollection);
app.post('/addToDoList', addToDoList);
app.post('/deleteToDoList', deleteToDoList);
app.post('/addTask', addTask);
app.post('/deleteTask', deleteTask);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/changeToDoListTitle', changeToDoListTitle);
app.post('/changeTaskText', changeTaskText);

module.exports = {app};
