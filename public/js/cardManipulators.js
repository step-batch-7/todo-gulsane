/* eslint-disable no-unused-vars */
const createDustbin = function () {
  const div = document.createElement('div');
  div.className = 'delete-todo-list-link';
  const deleteLink = document.createElement('img');
  deleteLink.setAttribute('src', 'images/deleteToDoList.png');
  deleteLink.onclick = deleteToDoList;
  div.appendChild(deleteLink);
  return div;
};


const createCheckBox = function (status) {
  const div = document.createElement('div');
  const checkBox = document.createElement('input');
  div.className = 'check-box';
  checkBox.setAttribute('type', 'checkbox');
  checkBox.checked = status;
  checkBox.onclick = toggleTaskStatus;
  div.appendChild(checkBox);
  return div;
};

const createTaskName = function (task) {
  const taskName = document.createElement('div');
  taskName.className = 'task-text';
  taskName.setAttribute('contentEditable', true);
  taskName.onblur = changeTaskTitle;
  taskName.innerText = task;
  return taskName;
};

const createTaskDeleteIcon = function () {
  const taskDeleteIcon = document.createElement('div');
  taskDeleteIcon.className = 'delete-task-link';
  taskDeleteIcon.onclick = deleteTask;
  const icon = document.createElement('img');
  icon.setAttribute('src', 'images/deleteTask.png');
  taskDeleteIcon.appendChild(icon);
  return taskDeleteIcon;
};

const createTaskDiv = function (id, title, status) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task';
  taskDiv.id = id;
  taskDiv.appendChild(createCheckBox(status));
  taskDiv.appendChild(createTaskName(title));
  taskDiv.appendChild(createTaskDeleteIcon());
  return taskDiv;
};

const createCardBody = function (tasks) {
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';
  tasks.forEach(function (task) {
    cardBody.appendChild(createTaskDiv(task.id, task.text, task.hasDone));
  });
  return cardBody;
};

const createCardFooter = function () {
  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const input = document.createElement('input');
  input.setAttribute('placeholder', 'Add Task...');
  input.className = 'newTask';
  input.onkeydown = addTask;
  footer.appendChild(input);
  return footer;
};

const createTaskRemoverIcon = function () {
  const icon = document.createElement('img');
  icon.className = 'taskRemoverIcon';
  icon.setAttribute('src', 'images/delete.png');
  icon.onclick = removeTask;
  return icon;
};

const createTask = function (task) {
  const taskArea = document.createElement('div');
  taskArea.className = 'taskArea';
  const paragraph = document.createElement('p');
  paragraph.className = 'F_tasks';
  paragraph.innerText = task;
  taskArea.appendChild(paragraph);
  taskArea.appendChild(createTaskRemoverIcon());
  return taskArea;
};

const prependToDoList = function (toDoList) {
  const toDoListsContainer = document.querySelector('.todo-lists-container');
  toDoListsContainer.prepend(addToDoListCard(toDoList));
};

const getNewTitle = function () {
  const title = document.querySelector('#new-title').value;
  return title;
};

const appendTask = function (toDoListElement, task) {
  const {id, text, hasDone} = task;
  const cardBody = toDoListElement.querySelector('.card-body');
  cardBody.appendChild(createTaskDiv(id, text, hasDone));
  cardBody.scrollTop = cardBody.scrollHeight;
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
  cardHeader.appendChild(createDustbin());
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
