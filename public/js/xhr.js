const createDustbin = function() {
  const dustbin = document.createElement('img');
  dustbin.className = 'dustbin';
  dustbin.setAttribute('src', 'images/delete.png');
  dustbin.onclick = deleteTitle;
  return dustbin;
};

const createHeader = function(title) {
  const cardHeader = document.createElement('div');
  cardHeader.className = 'cardHeader';
  const headTitle = document.createElement('h3');
  headTitle.className = 'headTitle';
  headTitle.innerText = title;
  cardHeader.appendChild(headTitle);
  cardHeader.appendChild(createDustbin());
  return cardHeader;
};

const addTitleCard = function(title, id) {
  const cardLayout = document.createElement('div');
  cardLayout.className = 'cardLayout';
  cardLayout.id = id;
  cardLayout.appendChild(createHeader(title));
  return cardLayout;
};

const loadAllToDo = function() {
  makeRequest({}, 'GET', '/toDoList', function() {
    if (this.status === 200) {
      const rightContainer = document.querySelector('.rightContainer');
      const toDoList = JSON.parse(this.responseText);
      toDoList.forEach(element => {
        rightContainer.appendChild(addTitleCard(element.value, element.id));
      });
    }
  });
};

const saveTitle = function() {
  const value = document.getElementById('titleInnerText').value;
  makeRequest({ value }, 'POST', '/saveTitle', function() {
    if (this.status === 201) {
      const rightContainer = document.querySelector('.rightContainer');
      const title = JSON.parse(this.responseText);
      rightContainer.appendChild(addTitleCard(title.value, title.id));
    }
  });
};

const deleteTitle = function() {
  const titleCard = event.target.parentElement.parentElement;
  const data = { id: titleCard.id };
  makeRequest(data, 'POST', '/deleteTitle', function() {
    titleCard.remove();
  });
};

const makeRequest = function(data, method, url, callBack) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.onload = callBack;
  request.send(JSON.stringify(data));
};

const createTask = function(task) {
  const taskArea = document.createElement('div');
  taskArea.className = 'taskArea';
  const paragraph = document.createElement('p');
  paragraph.innerText = task;
  taskArea.appendChild(paragraph);
  return taskArea;
};

const appendTask = function() {
  const formBody = document.querySelector('.formBody');
  const task = document.querySelector('#task').value;
  formBody.append(createTask(task));
};
