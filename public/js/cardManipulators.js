/* eslint-disable no-unused-vars */
const getNewTitle = function () {
  const title = document.querySelector('#new-title').value;
  return title;
};

const createCardFooter = function () {
  const footerDiv = document.createElement('div');
  footerDiv.className = 'card-footer';
  const taskInput = document.createElement('input');
  taskInput.setAttribute('placeholder', 'Add Task...');
  taskInput.onkeydown = addTask;
  footerDiv.appendChild(taskInput);
  return footerDiv;
};

const createTaskDeleteIcon = function () {
  const deleteIconDiv = document.createElement('div');
  deleteIconDiv.className = 'delete-task-link';
  deleteIconDiv.onclick = deleteTask;
  const deleteIcon = document.createElement('img');
  deleteIcon.setAttribute('src', 'images/deleteTask.png');
  deleteIconDiv.appendChild(deleteIcon);
  return deleteIconDiv;
};

const createTaskText = function (text) {
  const taskName = document.createElement('div');
  taskName.className = 'task-text';
  taskName.setAttribute('contentEditable', true);
  taskName.onblur = changeTaskText;
  taskName.innerText = text;
  return taskName;
};

const createCheckBox = function (status) {
  const checkBoxDiv = document.createElement('div');
  const checkBox = document.createElement('input');
  checkBoxDiv.className = 'check-box';
  checkBox.setAttribute('type', 'checkbox');
  checkBox.checked = status;
  checkBox.onclick = toggleTaskStatus;
  checkBoxDiv.appendChild(checkBox);
  return checkBoxDiv;
};

const createTaskDiv = function (task) {
  const {id, text, hasDone} = task;
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';
  taskDiv.id = id;
  taskDiv.appendChild(createCheckBox(hasDone));
  taskDiv.appendChild(createTaskText(text));
  taskDiv.appendChild(createTaskDeleteIcon());
  return taskDiv;
};

const createCardBody = function (tasks) {
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  tasks.forEach((task) => {
    cardBody.appendChild(createTaskDiv(task));
  });
  return cardBody;
};

const createListDeleteIcon = function () {
  const div = document.createElement('div');
  div.className = 'delete-todo-list-link';
  const deleteLink = document.createElement('img');
  deleteLink.setAttribute('src', 'images/deleteToDoList.png');
  deleteLink.onclick = deleteToDoList;
  div.appendChild(deleteLink);
  return div;
};

const createHeadingDiv = function (title) {
  const headingDiv = document.createElement('div');
  headingDiv.className = 'card-heading';
  headingDiv.setAttribute('contentEditable', 'true');
  headingDiv.onblur = changeTodoListTitle;
  const headTitle = document.createElement('h2');
  headTitle.innerText = title;
  headingDiv.appendChild(headTitle);
  return headingDiv;
};

const createCardHeader = function (title) {
  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';
  cardHeader.appendChild(createHeadingDiv(title));
  cardHeader.appendChild(createListDeleteIcon());
  return cardHeader;
};

const addToDoListCard = function (toDoList) {
  const todoListCard = document.createElement('div');
  todoListCard.className = 'todo-list-card';
  todoListCard.id = toDoList.id;
  todoListCard.appendChild(createCardHeader(toDoList.title));
  todoListCard.appendChild(createCardBody(toDoList.tasks));
  todoListCard.appendChild(createCardFooter());
  return todoListCard;
};

const generateAllToDoList = function (toDoLists) {
  const toDoListsContainer = document.querySelector('.todo-lists-container');
  toDoLists.forEach(toDoList => {
    toDoListsContainer.prepend(addToDoListCard(toDoList));
  });
};

const prependToDoList = function (toDoList) {
  const toDoListsContainer = document.querySelector('.todo-lists-container');
  toDoListsContainer.prepend(addToDoListCard(toDoList));
};

const appendTask = function (toDoListElement, task) {
  const cardBody = toDoListElement.querySelector('.card-body');
  cardBody.appendChild(createTaskDiv(task));
  cardBody.scrollTop = cardBody.scrollHeight;
};
