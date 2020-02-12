const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mediaType.js');
const {App} = require('./app.js');
const {config} = require('../config.js');
const {ToDoListCollection} = require('./toDoListCollection.js');

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

const toDoListCollection = ToDoListCollection.load(loadToDoLists());

const writeDataFile = function () {
  fs.writeFileSync(config.DATA_STORE, toDoListCollection.toJSON());
};

const serveToDoListCollection = function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(toDoListCollection.toJSON());
};

const addToDoList = function (req, res) {
  const {title} = req.body;
  toDoListCollection.add(title);
  const lastToDoList = toDoListCollection.lastToDoList;
  writeDataFile();
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(lastToDoList));
};

const deleteToDoList = function (req, res) {
  const {toDoListId} = req.body;
  toDoListCollection.delete(toDoListId);
  writeDataFile();
  res.writeHead(200);
  res.end();
};

const addTask = function (req, res) {
  const {toDoListId, text} = req.body;
  toDoListCollection.addTask(toDoListId, text);
  const task = toDoListCollection.getLastTask(toDoListId);
  writeDataFile();
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(task));
};

const deleteTask = function (req, res) {
  const toDoListId = req.body.toDoId;
  const taskId = req.body.taskId;
  toDoListCollection.deleteTask(toDoListId, taskId);
  writeDataFile();
  res.writeHead(200);
  res.end();
};

const toggleTaskStatus = function (req, res) {
  const toDoListId = req.body.toDoId;
  const taskId = req.body.taskId;
  toDoListCollection.toggleTaskStatus(toDoListId, taskId);
  writeDataFile();
  res.writeHead(200);
  res.end();
};

const changeTaskText = function (req, res) {
  const {toDoId, taskId, newTitle} = req.body;
  toDoListCollection.changeTaskTitle(toDoId, taskId, newTitle);
  writeDataFile();
  res.writeHead(200);
  res.end();
};

const changeToDoListTitle = function (req, res) {
  const toDoListId = req.body.toDoId;
  const newTitle = req.body.newTitle;
  toDoListCollection.changeToDoListTitle(toDoListId, newTitle);
  writeDataFile();
  res.writeHead(200);
  res.end();
};

const getExtension = url => {
  const [, extension] = url.match(/.*\.(.*)$/);
  return extension;
};

const getStaticFolder = () => {
  const STATIC_FOLDER = `${__dirname}/../public`;
  return STATIC_FOLDER;
};

const decidePath = function (url) {
  const path = url === '/' ? '/index.html' : url;
  return path;
};

const serveStaticFile = function (req, res, next) {
  const path = decidePath(req.url);
  const absolutePath = `${getStaticFolder()}` + path;
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  if (!stat || !stat.isFile()) {
    return next();
  }
  const content = fs.readFileSync(absolutePath);
  const extension = getExtension(path);
  res.setHeader('Content-Type', CONTENT_TYPES[extension]);
  res.end(content);
};

const readBody = function (req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(data);
    }
    if (data) {
      req.body = JSON.parse(data);
    }
    next();
  });
};

const notFound = function (req, res) {
  const statusCode = 404;
  res.writeHead(statusCode);
  res.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  const statusCode = 400;
  res.writeHead(statusCode, 'Method Not Allowed');
  res.end();
};

const app = new App();

app.use(readBody);
app.get('', serveStaticFile);
app.get('/toDoLists', serveToDoListCollection);
app.get('', notFound);
app.post('/addToDoList', addToDoList);
app.post('/deleteToDoList', deleteToDoList);
app.post('/addTask', addTask);
app.post('/deleteTask', deleteTask);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/changeToDoListTitle', changeToDoListTitle);
app.post('/changeTaskTitle', changeTaskText);
app.post('', methodNotAllowed);
app.use(methodNotAllowed);

module.exports = {app};
