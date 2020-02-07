const createDustbin = function() {
  const dustbin = document.createElement('img');
  dustbin.className = 'dustbin';
  dustbin.setAttribute('src', 'images/delete.png');
  dustbin.onclick = deleteToDo;
  return dustbin;
};

const createCardHeader = function(title) {
  const cardHeader = document.createElement('div');
  cardHeader.className = 'cardHeader';
  const headTitle = document.createElement('h3');
  headTitle.className = 'headTitle';
  headTitle.innerText = title;
  cardHeader.appendChild(headTitle);
  cardHeader.appendChild(createDustbin());
  return cardHeader;
};

const createCheckBox = function() {
  const checkBox = document.createElement('input');
  checkBox.className = 'checkBox';
  checkBox.setAttribute('type', 'checkbox');
  return checkBox;
};

const createTaskName = function(task) {
  const taskName = document.createElement('div');
  taskName.className = 'taskName';
  taskName.innerText = task;
  return taskName;
};

const createTaskDeleteIcon = function() {
  const taskDeleteIcon = document.createElement('div');
  taskDeleteIcon.className = 'taskDeleteIcon';
  taskDeleteIcon.onclick = deleteTask;
  const icon = document.createElement('img');
  icon.setAttribute('src', 'images/delete.png');
  taskDeleteIcon.appendChild(icon);
  return taskDeleteIcon;
};

const createTaskDiv = function(task, id) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'taskDiv';
  taskDiv.id = id;
  taskDiv.appendChild(createCheckBox());
  taskDiv.appendChild(createTaskName(task));
  taskDiv.appendChild(createTaskDeleteIcon());
  return taskDiv;
};

const createCardBody = function(tasks) {
  const cardBody = document.createElement('div');
  cardBody.className = 'cardBody';
  tasks.forEach(function(task) {
    cardBody.appendChild(createTaskDiv(task.title, task.id));
  });
  return cardBody;
};

const addToDoCard = function(respondedTodo) {
  const cardLayout = document.createElement('div');
  cardLayout.className = 'cardLayout';
  cardLayout.id = respondedTodo.id;
  cardLayout.appendChild(createCardHeader(respondedTodo.title));
  cardLayout.appendChild(createCardBody(respondedTodo.tasks));
  return cardLayout;
};

const loadAllToDo = function() {
  makeRequest({}, 'GET', '/toDoList', function() {
    if (this.status === 200) {
      const rightContainer = document.querySelector('.rightContainer');
      const toDoList = JSON.parse(this.responseText);
      toDoList.forEach(element => {
        rightContainer.appendChild(addToDoCard(element));
      });
    }
  });
};

const saveTitle = function(toDoContent) {
  makeRequest(toDoContent, 'POST', '/saveToDo', function() {
    if (this.status === 201) {
      const rightContainer = document.querySelector('.rightContainer');
      const respondedToDo = JSON.parse(this.responseText);
      rightContainer.appendChild(addToDoCard(respondedToDo));
    }
  });
};

const deleteToDo = function() {
  const toDoCard = event.target.parentElement.parentElement;
  const data = { id: toDoCard.id };
  makeRequest(data, 'POST', '/deleteToDo', function() {
    toDoCard.remove();
  });
};

const deleteTask = function() {
  const taskDiv = event.target.parentElement.parentElement;
  const taskId = taskDiv.id;
  const toDoId = taskDiv.parentElement.parentElement.id;
  makeRequest({ toDoId, taskId }, 'POST', '/deleteTask', function() {
    taskDiv.remove();
  });
};

const makeRequest = function(data, method, url, callBack) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.onload = callBack;
  request.send(JSON.stringify(data));
};

const removeTask = function() {
  const taskArea = event.target.parentElement;
  taskArea.remove();
};

const createTaskRemoverIcon = function() {
  const icon = document.createElement('img');
  icon.className = 'taskRemoverIcon';
  icon.setAttribute('src', 'images/delete.png');
  icon.onclick = removeTask;
  return icon;
};

const createTask = function(task) {
  const taskArea = document.createElement('div');
  taskArea.className = 'taskArea';
  const paragraph = document.createElement('p');
  paragraph.className = 'F_tasks';
  paragraph.innerText = task;
  taskArea.appendChild(paragraph);
  taskArea.appendChild(createTaskRemoverIcon());
  return taskArea;
};

const appendTask = function() {
  const formBody = document.querySelector('.formBody');
  const task = document.querySelector('#F_inputTask').value;
  formBody.append(createTask(task));
  formBody.scrollTop = formBody.scrollHeight;
};

const extractToDoContent = function() {
  const title = document.querySelector('#F_title').value;
  const tasksElements = document.querySelectorAll('.F_tasks');
  const tasks = Array.from(tasksElements).map(task => {
    return task.innerText;
  });
  return { title, tasks };
};

const submitToDo = function() {
  const toDoContent = extractToDoContent();
  saveTitle(toDoContent);
};

const main = () => {
  loadAllToDo();
};
window.onload = main;
