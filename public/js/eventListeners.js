/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const isEmpty = function (searchKey) {
  return searchKey === '';
};

const isUnmatched = function (element, searchKey) {
  return !element.innerText.toLowerCase().includes(searchKey.toLowerCase());
};

const isTaskAvailable = function (cardElement, searchTask) {
  const tasksElements = Array.from(
    cardElement.querySelectorAll('.task-text')
  );
  return tasksElements.some((task) => !isUnmatched(task, searchTask));
};

const filterTask = function () {
  const searchTask = document.querySelector('#search-task').value;

  const cardElements = Array.from(
    document.querySelectorAll('.todo-list-card')
  );

  cardElements.forEach((cardElement) => {
    if (isTaskAvailable(cardElement, searchTask) || isEmpty(searchTask)) {
      cardElement.classList.remove('hide');

      const tasksElements = Array.from(
        cardElement.querySelectorAll('.task-text')
      );

      tasksElements.forEach((task) => {
        if (!isEmpty(searchTask) && isUnmatched(task, searchTask)) {
          task.parentElement.classList.add('hide');
          return;
        }
        task.parentElement.classList.remove('hide');
      });
    } else {
      cardElement.classList.add('hide');
    }

  });
};

const resetTaskSearchBar = function () {
  const searchTaskElement = document.querySelector('#search-task');
  searchTaskElement.value = '';
  filterTask();
};

const filterTitle = function () {
  const searchTitle = document.querySelector('#search-title').value;
  const cardHeadingElements = Array.from(
    document.querySelectorAll('.card-heading')
  );

  cardHeadingElements.forEach((element) => {
    if (!isEmpty(searchTitle) && isUnmatched(element, searchTitle)) {
      element.parentElement.parentElement.classList.add('hide');
      return;
    }
    element.parentElement.parentElement.classList.remove('hide');
  });
};

const resetTitleSearchBar = function () {
  const searchTitleElement = document.querySelector('#search-title');
  searchTitleElement.value = '';
  filterTitle();
};

const changeTaskText = function () {
  const taskName = event.target;
  const newText = taskName.innerText;
  const taskDiv = taskName.parentElement;
  const taskId = taskDiv.id;
  const toDoListId = taskDiv.parentElement.parentElement.id;
  requestPost('/changeTaskText', {toDoListId, taskId, newText}, () => {});
};

const changeTodoListTitle = function () {
  const titleElement = event.target;
  const newTitle = titleElement.innerText;
  const toDoListElement = titleElement.parentElement.parentElement.parentElement;
  const toDoListId = toDoListElement.id;
  requestPost('/changeToDoListTitle', {toDoListId, newTitle}, () => {});
};

const blurOnEnter = function () {
  if (event.key === 'Enter') {
    event.target.blur();
  }
};

const toggleTaskStatus = function () {
  const taskDiv = event.target.parentElement.parentElement;
  const taskId = taskDiv.id;
  const toDoListId = taskDiv.parentElement.parentElement.id;
  requestPost('/toggleTaskStatus', {toDoListId, taskId}, () => {});
};

const deleteTask = function () {
  const taskDiv = event.target.parentElement.parentElement;
  const taskId = taskDiv.id;
  const toDoListId = taskDiv.parentElement.parentElement.id;
  requestPost('/deleteTask', {toDoListId, taskId}, function () {
    taskDiv.remove();
  });
};

const addTask = function () {
  const inputTask = event.target.parentElement.querySelector('input');
  const text = inputTask.value;
  if (text) {
    inputTask.value = '';
    const toDoListElement = inputTask.parentElement.parentElement;
    const toDoListId = toDoListElement.id;
    requestPost('/addTask', {toDoListId, text}, function (task) {
      appendTask(toDoListElement, task);
    });
  }
};

const createTask = function () {
  if (event.key === 'Enter') {
    addTask();
  }
};

const deleteToDoList = function () {
  const toDoListCard = event.target.parentElement.parentElement.parentElement;
  const data = {toDoListId: toDoListCard.id};
  requestPost('/deleteToDoList', data, function () {
    toDoListCard.remove();
  });
};

const addToDoList = function () {
  const titleContainer = document.querySelector('#new-title');
  const title = titleContainer.value;
  if (title === '') {
    return;
  }
  requestPost('/addToDoList', {title}, function (toDoList) {
    prependToDoList(toDoList);
    titleContainer.value = '';
  });
};

const createToDoList = function () {
  if (event.key === 'Enter') {
    addToDoList();
  }
};

const loadAllToDoList = function () {
  requestGet('/toDoLists', function (toDoLists) {
    generateAllToDoList(toDoLists);
  });
};

window.onload = loadAllToDoList;
