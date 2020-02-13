const fs = require('fs');
const express = require('express');
const {config} = require('../config.js');
const {ToDoListCollection} = require('./toDoListCollection.js');

const app = express();

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

const writeDataFile = function (toDoListCollection) {
  fs.writeFileSync(config.DATA_STORE, toDoListCollection.toJSON());
};

const serveToDoListCollection = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(toDoListCollection.toJSON());
};

const addToDoList = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {title} = req.body;
  toDoListCollection.add(title);
  const lastToDoList = toDoListCollection.lastToDoList;
  writeDataFile(toDoListCollection);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(lastToDoList));
};

const deleteToDoList = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId} = req.body;
  toDoListCollection.delete(toDoListId);
  writeDataFile(toDoListCollection);
  res.writeHead(200);
  res.end();
};

const addTask = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, text} = req.body;
  toDoListCollection.addTask(toDoListId, text);
  const task = toDoListCollection.getLastTask(toDoListId);
  writeDataFile(toDoListCollection);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(task));
};

const deleteTask = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, taskId} = req.body;
  toDoListCollection.deleteTask(toDoListId, taskId);
  writeDataFile(toDoListCollection);
  res.writeHead(200);
  res.end();
};

const toggleTaskStatus = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, taskId} = req.body;
  toDoListCollection.toggleTaskStatus(toDoListId, taskId);
  writeDataFile(toDoListCollection);
  res.writeHead(200);
  res.end();
};

const changeToDoListTitle = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, newTitle} = req.body;
  toDoListCollection.changeToDoListTitle(toDoListId, newTitle);
  writeDataFile(toDoListCollection);
  res.writeHead(200);
  res.end();
};

const changeTaskText = function (req, res) {
  const toDoListCollection = ToDoListCollection.load(loadToDoLists());
  const {toDoListId, taskId, newText} = req.body;
  toDoListCollection.changeTaskText(toDoListId, taskId, newText);
  writeDataFile(toDoListCollection);
  res.writeHead(200);
  res.end();
};

app.use(express.json());
app.use(express.static('public'));
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
