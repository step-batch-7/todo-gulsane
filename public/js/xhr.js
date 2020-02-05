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
  const req = new XMLHttpRequest();
  req.open('GET', '/toDoList');
  req.onload = function() {
    if (req.status === 200) {
      const rightContainer = document.querySelector('.rightContainer');
      const toDoList = JSON.parse(req.responseText);
      toDoList.forEach(element => {
        rightContainer.appendChild(addTitleCard(element.value, element.id));
      });
    }
  };
  req.send();
};

const saveTitle = function() {
  const req = new XMLHttpRequest();
  req.open('POST', '/saveTitle');
  req.setRequestHeader('Content-Type', 'application/json');
  req.onload = function() {
    if (req.status === 201) {
      const rightContainer = document.querySelector('.rightContainer');
      const title = JSON.parse(req.responseText);
      rightContainer.appendChild(addTitleCard(title.value, title.id));
    }
  };
  const value = document.getElementById('titleInnerText').value;
  req.send(JSON.stringify({ value }));
};

const deleteTitle = function() {
  const titleCard = event.target.parentElement.parentElement;
  const req = new XMLHttpRequest();
  req.open('POST', 'deleteTitle');
  req.onload = function() {
    titleCard.remove();
  };
  req.send(JSON.stringify({ id: titleCard.id }));
};
