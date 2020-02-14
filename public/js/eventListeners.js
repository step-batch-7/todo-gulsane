

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


const requestPost = (url, data, callBack) =>
  request('POST', url, data, callBack);

const removeTask = function () {
  const taskArea = event.target.parentElement;
  taskArea.remove();
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

const request = function (method, url, data, callBack) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = callBack;
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/json');
  }
  xhr.send(JSON.stringify(data));
};

const isOkStatus = function (status) {
  return status === 200;
};

const isJSON = function (contentType) {
  return contentType === 'application/json';
};

const isValidResponse = function (res) {
  const isOk = isOkStatus(res.status);
  const isJSONContentType = isJSON(res.getResponseHeader('Content-Type'));
  return isOk && isJSONContentType;
};

const requestGet = function (url, callBack) {
  const req = new XMLHttpRequest();
  req.open('GET', url);
  req.onload = function () {
    if (isValidResponse(this)) {
      callBack(JSON.parse(this.responseText));
    }
  };
  req.send();
};

const loadAllToDoList = function () {
  requestGet('/toDoLists', function (toDoLists) {
    generateAllToDoList(toDoLists);
  });
};

window.onload = loadAllToDoList;
