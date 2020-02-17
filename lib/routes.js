const express = require('express');
const cookieParser = require('cookie-parser');

const {
  addUser,
  verifyUser,
  ensureLoggedIn,
  serveHomePage,
  serveToDoListCollection,
  addToDoList,
  deleteToDoList,
  addTask,
  deleteTask,
  toggleTaskStatus,
  changeToDoListTitle,
  changeTaskText
} = require('./handlers');

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.post('/signUp', addUser);
app.post('/login', verifyUser);
app.use(express.static('public'));
app.use(ensureLoggedIn);
app.get('/home', serveHomePage);
app.get('/', (req, res) => res.redirect('homepage.html'));
app.get('/toDoLists', serveToDoListCollection);
app.post('/addToDoList', addToDoList);
app.post('/deleteToDoList', deleteToDoList);
app.post('/addTask', addTask);
app.post('/deleteTask', deleteTask);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/changeToDoListTitle', changeToDoListTitle);
app.post('/changeTaskText', changeTaskText);

module.exports = {app};
