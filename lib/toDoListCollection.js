const {ToDoList} = require('./toDoList');

class ToDoListCollection {

  constructor (toDoLists) {
    this.toDoLists = toDoLists;
  }

  get allToDoList() {
    return this.toDoLists.slice();
  }

  get lastToDoList() {
    const totalToDoList = this.toDoLists.length;
    return this.toDoLists[totalToDoList - 1];
  }

  getNewToDoListId() {
    const lastToDo = this.lastToDoList;
    const lastIdNum = lastToDo ? +lastToDo.id.split('-').pop() : 0;
    return `tl-${lastIdNum + 1}`;
  }

  add(title) {
    const id = this.getNewToDoListId();
    const toDoList = new ToDoList(id, title, []);
    this.toDoLists.push(toDoList);
  }

  delete(toDoListId) {
    const indexOfToDoList = this.toDoLists.findIndex(toDoList => {
      return toDoList.id === toDoListId;
    });
    this.toDoLists.splice(indexOfToDoList, 1);
  }

  findToDoList(toDoListId) {
    return this.toDoLists.find(toDoList => toDoList.id === toDoListId);
  }

  addTask(toDoListId, text) {
    const toDoList = this.findToDoList(toDoListId);
    toDoList.add(text);
  }

  getLastTask(toDoListId) {
    const toDoList = this.findToDoList(toDoListId);
    return toDoList.lastTask;
  }

  deleteTask(toDoListId, taskId) {
    const toDoList = this.findToDoList(toDoListId);
    toDoList.delete(taskId);
  }

  toggleTaskStatus(toDoListId, taskId) {
    const toDoList = this.findToDoList(toDoListId);
    toDoList.toggleStatus(taskId);
  }

  changeToDoListTitle(toDoListId, newTitle) {
    const toDoList = this.findToDoList(toDoListId);
    toDoList.changeTitle(newTitle);
  }

  changeTaskText(toDoListId, taskId, newText) {
    const toDoList = this.findToDoList(toDoListId);
    toDoList.changeTaskText(taskId, newText);
  }

  toJSON() {
    return JSON.stringify(this.allToDoList);
  }

  static load(list) {
    const toDoLists = list.map(toDoListObj => ToDoList.load(toDoListObj));
    return new ToDoListCollection(toDoLists);
  }

}

module.exports = {ToDoListCollection};
