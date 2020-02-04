const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mediaType.js');
const { App } = require('./app.js');
const { config } = require('../config.js');

const loadToDoList = () => {
  const toDoList = fs.readFileSync(config.DATA_STORE, 'utf8');
  return JSON.parse(toDoList || '[]');
};

const toDoList = loadToDoList();

const serveToDoList = function(req, res) {
  res.statusCode = 200;
  res.end(JSON.stringify(toDoList));
};

const saveTitle = function(req, res) {
  const title = {};
  title.value = req.body.value;
  toDoList.push(title);
  fs.writeFileSync(config.DATA_STORE, `${JSON.stringify(toDoList)}`);
  res.statusCode = 201;
  res.end(JSON.stringify(title));
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
    req.body = data;
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(data);
    }
    if (req.headers['content-type'] === 'application/json') {
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
app.post('/saveTitle', saveTitle);
app.get('/toDoList', serveToDoList);
app.get('', serveStaticFile);
app.get('', notFound);
app.post('', methodNotAllowed);
app.use(methodNotAllowed);

module.exports = { app };
