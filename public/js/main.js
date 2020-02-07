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
  requestGet('/toDoList', function() {
    if (this.status === 200) {
      const toDoList = JSON.parse(this.responseText);
      const rightContainer = document.querySelector('.rightContainer');
      toDoList.forEach(element => {
        rightContainer.appendChild(addToDoCard(element));
      });
    }
  });
};

const extractToDoContent = function() {
  const title = document.querySelector('#F_title').value;
  const tasksElements = document.querySelectorAll('.F_tasks');
  const tasks = Array.from(tasksElements).map(task => {
    return task.innerText;
  });
  return { title, tasks };
};

const saveToDo = function() {
  const toDoContent = extractToDoContent();
  requestPost('/saveToDo', toDoContent, function() {
    if (this.status === 200) {
      const rightContainer = document.querySelector('.rightContainer');
      const respondedToDo = JSON.parse(this.responseText);
      rightContainer.appendChild(addToDoCard(respondedToDo));
    }
  });
};

const deleteToDo = function() {
  const toDoCard = event.target.parentElement.parentElement;
  const data = { id: toDoCard.id };
  requestPost('/deleteToDo', data, function() {
    toDoCard.remove();
  });
};

const deleteTask = function() {
  const taskDiv = event.target.parentElement.parentElement;
  const taskId = taskDiv.id;
  const toDoId = taskDiv.parentElement.parentElement.id;
  requestPost('/deleteTask', { toDoId, taskId }, function() {
    taskDiv.remove();
  });
};

const request = function(method, url, data, callBack) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = callBack;
  xhr.send(JSON.stringify(data));
};

const requestGet = (url, callBack) => request('GET', url, {}, callBack);
const requestPost = (url, data, callBack) =>
  request('POST', url, data, callBack);

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

const main = () => {
  loadAllToDo();
};
window.onload = main;
