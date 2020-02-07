const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mediaType.js');
const { App } = require('./app.js');
const { config } = require('../config.js');
const { ToDoList } = require('../lib/toDoList.js');

const loadToDoList = () => {
  const toDoList = fs.readFileSync(config.DATA_STORE, 'utf8');
  return JSON.parse(toDoList || '[]');
};

const toDoList = ToDoList.load(loadToDoList());

const serveToDoList = function(req, res) {
  res.statusCode = 200;
  res.end(toDoList.toJSON());
};

const saveToDo = function(req, res) {
  const { title, tasks } = req.body;
  const toDo = toDoList.addNewToDo(title, tasks);
  fs.writeFileSync(config.DATA_STORE, toDoList.toJSON());
  res.statusCode = 200;
  res.end(JSON.stringify(toDo));
};

const deleteToDo = function(req, res) {
  const toDoId = req.body.toDoId;
  toDoList.deleteToDo(toDoId);
  fs.writeFileSync(config.DATA_STORE, toDoList.toJSON());
  res.statusCode = 200;
  res.end();
};

const deleteTask = function(req, res) {
  const { toDoId, taskId } = req.body;
  toDoList.deleteToDoTask(toDoId, taskId);
  fs.writeFileSync(config.DATA_STORE, toDoList.toJSON());
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
app.post('/saveToDo', saveToDo);
app.post('/deleteToDo', deleteToDo);
app.post('/deleteTask', deleteTask);
app.get('/toDoList', serveToDoList);
app.get('', serveStaticFile);
app.get('', notFound);
app.post('', methodNotAllowed);
app.use(methodNotAllowed);

module.exports = { app };
