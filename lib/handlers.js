const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mediaType.js');
const { App } = require('./app.js');
const { config } = require('../config.js');

const loadToDoData = () => {
  const toDoData = fs.readFileSync(config.DATA_STORE, 'utf8');
  const newToDoData = JSON.stringify({ toDoCount: 0, toDoList: [] });
  return JSON.parse(toDoData || newToDoData);
};

const toDoData = loadToDoData();

const serveToDoList = function(req, res) {
  res.statusCode = 200;
  res.end(JSON.stringify(toDoData.toDoList));
};

const saveTodo = function(req, res) {
  const { title, tasks } = req.body;
  const toDo = { title, tasks: [] };
  toDoData.toDoCount += 1;
  toDo.id = `TODO_${toDoData.toDoCount}`;
  toDo.taskCount = 0;
  tasks.forEach(title => {
    const task = {};
    toDo.taskCount += 1;
    task.id = `${toDo.id}:TASK_${toDo.taskCount}`;
    task.title = title;
    toDo.tasks.push(task);
  });
  toDoData.toDoList.push(toDo);
  fs.writeFileSync(config.DATA_STORE, `${JSON.stringify(toDoData)}`);
  res.statusCode = 201;
  res.end(JSON.stringify(toDo));
};

const deleteToDo = function(req, res) {
  const indexOfToDo = toDoData.toDoList.findIndex(toDo => {
    return toDo.id === req.body.id;
  });
  toDoData.toDoList.splice(indexOfToDo, 1);
  fs.writeFileSync(config.DATA_STORE, `${JSON.stringify(toDoData)}`);
  res.statusCode = 200;
  res.end();
};

const deleteTask = function(req, res) {
  const indexOfToDo = toDoData.toDoList.findIndex(toDo => {
    return toDo.id === req.body.toDoId;
  });
  const toDo = toDoData.toDoList[indexOfToDo];
  const indexOfTask = toDo.tasks.findIndex(task => {
    return task.Id === req.body.taskId;
  });
  toDoData.toDoList[indexOfToDo].tasks.splice(indexOfTask, 1);
  fs.writeFileSync(config.DATA_STORE, `${JSON.stringify(toDoData)}`);
  res.statusCode = 200;
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

const decidePath = function(url) {
  const path = url === '/' ? '/index.html' : url;
  return path;
};

const serveStaticFile = function(req, res, next) {
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

const readBody = function(req, res, next) {
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

const notFound = function(req, res) {
  const statusCode = 404;
  res.writeHead(statusCode);
  res.end('Not Found');
};

const methodNotAllowed = function(req, res) {
  const statusCode = 400;
  res.writeHead(statusCode, 'Method Not Allowed');
  res.end();
};

const app = new App();

app.use(readBody);
app.post('/saveToDo', saveTodo);
app.post('/deleteToDo', deleteToDo);
app.post('/deleteTask', deleteTask);
app.get('/toDoList', serveToDoList);
app.get('', serveStaticFile);
app.get('', notFound);
app.post('', methodNotAllowed);
app.use(methodNotAllowed);

module.exports = { app };
