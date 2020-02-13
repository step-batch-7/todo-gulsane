const createDustbin = function () {
  const div = document.createElement('div');
  div.className = 'delete-todo-list-link';
  const deleteLink = document.createElement('img');
  deleteLink.setAttribute('src', 'images/deleteToDoList.png');
  deleteLink.onclick = deleteToDo;
  div.appendChild(deleteLink);
  return div;
};

// eslint-disable-next-line max-statements
const createCardHeader = function (title) {
  const cardHeader = document.createElement('div');
  cardHeader.className = 'card-header';
  const headerDiv = document.createElement('div');
  headerDiv.className = 'card-heading';
  headerDiv.setAttribute('contentEditable', 'true');
  headerDiv.onblur = changeTodoListTitle;
  const headTitle = document.createElement('h2');
  headTitle.innerText = title;
  headerDiv.appendChild(headTitle);
  cardHeader.appendChild(headerDiv);
  cardHeader.appendChild(createDustbin());
  return cardHeader;
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
  input.onkeydown = addNewTask;
  footer.appendChild(input);
  return footer;
};

const addToDoCard = function (respondedTodo) {
  const todoListCard = document.createElement('div');
  todoListCard.className = 'todo-list-card';
  todoListCard.id = respondedTodo.id;
  todoListCard.appendChild(createCardHeader(respondedTodo.title));
  todoListCard.appendChild(createCardBody(respondedTodo.tasks));
  todoListCard.appendChild(createCardFooter());
  return todoListCard;
};

const loadAllToDo = function () {
  requestGet('/toDoLists', function () {
    if (this.status === 200) {
      const toDoList = JSON.parse(this.responseText);
      const rightContainer = document.querySelector('.todo-lists-container');
      toDoList.forEach(element => {
        rightContainer.appendChild(addToDoCard(element));
      });
    }
  });
};

const extractToDoTitle = function () {
  const title = document.querySelector('#new-title').value;
  return title;
};

const addToDoList = function () {
  const title = extractToDoTitle();
  requestPost('/addToDoList', {title}, function () {
    if (this.status === 200) {
      const rightContainer = document.querySelector('.todo-lists-container');
      const respondedToDo = JSON.parse(this.responseText);
      rightContainer.appendChild(addToDoCard(respondedToDo));
    }
  });
};

const deleteToDo = function () {
  const toDoCard = event.target.parentElement.parentElement.parentElement;
  const data = {toDoListId: toDoCard.id};
  requestPost('/deleteToDoList', data, function () {
    toDoCard.remove();
  });
};

const deleteTask = function () {
  const taskDiv = event.target.parentElement.parentElement;
  const taskId = taskDiv.id;
  const toDoListId = taskDiv.parentElement.parentElement.id;
  requestPost('/deleteTask', {toDoListId, taskId}, function () {
    taskDiv.remove();
  });
};

const toggleTaskStatus = function () {
  const taskDiv = event.target.parentElement.parentElement;
  const taskId = taskDiv.id;
  const toDoListId = taskDiv.parentElement.parentElement.id;
  requestPost('/toggleTaskStatus', {toDoListId, taskId}, function () {});
};

const addNewTask = function () {
  if (event.key === 'Enter') {
    const text = event.srcElement.value;
    event.srcElement.value = '';
    const toDo = event.srcElement.parentElement.parentElement;
    requestPost('/addTask', {toDoListId: toDo.id, text}, function () {
      const {id, text, hasDone} = JSON.parse(this.responseText);
      const cardBody = toDo.querySelector('.card-body');
      cardBody.appendChild(createTaskDiv(id, text, hasDone));
      cardBody.scrollTop = cardBody.scrollHeight;
    });
  }
};

const changeTodoListTitle = function () {
  const titleElement = event.target;
  const newTitle = titleElement.innerText;
  const toDoListElement = titleElement.parentElement.parentElement;
  const toDoListId = toDoListElement.id;
  requestPost('/changeToDoListTitle', {toDoListId, newTitle}, function () {});
};

const changeTaskTitle = function () {
  const taskName = event.target;
  const newText = taskName.innerText;
  const taskDiv = taskName.parentElement;
  const taskId = taskDiv.id;
  const toDoListId = taskDiv.parentElement.parentElement.id;
  requestPost('/changeTaskText', {toDoListId, taskId, newText}, function () {});
};

const request = function (method, url, data, callBack) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = callBack;
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/json');
  }
  xhr.send(JSON.stringify(data));
};

const requestGet = (url, callBack) => request('GET', url, {}, callBack);
const requestPost = (url, data, callBack) =>
  request('POST', url, data, callBack);

const removeTask = function () {
  const taskArea = event.target.parentElement;
  taskArea.remove();
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

const appendTask = function () {
  const formBody = document.querySelector('.formBody');
  const task = document.querySelector('#F_inputTask').value;
  formBody.append(createTask(task));
  formBody.scrollTop = formBody.scrollHeight;
};

const isUnmatched = function (element, searchKey) {
  return !element.innerText.toLowerCase().includes(searchKey.toLowerCase());
};

const filterTitle = function () {
  const searchTitle = document.querySelector('#search-title').value;
  const cardHeadingElements = Array.from(
    document.querySelectorAll('.card-heading')
  );

  cardHeadingElements.forEach((element) => {
    if (searchTitle !== '' && isUnmatched(element, searchTitle)) {
      element.parentElement.parentElement.classList.add('hide');
      return;
    }
    element.parentElement.parentElement.classList.remove('hide');
  });
};

const filterTask = function () {
  const searchTask = document.querySelector('#search-task').value;
  const tasksElements = Array.from(
    document.querySelectorAll('.task-text')
  );

  tasksElements.forEach((element) => {
    if (searchTask !== '' && isUnmatched(element, searchTask)) {
      element.parentElement.classList.add('hide');
      return;
    }
    element.parentElement.classList.remove('hide');
  });
};

const main = () => {
  loadAllToDo();
};
window.onload = main;
