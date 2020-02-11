const {ToDoList} = require('./toDoList');

class ToDoListCollection {

  constructor (toDoLists) {
    this.toDoLists = toDoLists;
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

  toJSON() {
    return JSON.stringify(this.toDoLists);
  }

  changeTaskTitle(toDoId, taskId, newTitle) {
    const toDo = this.findToDoList(toDoId);
    toDo.changeTaskTitle(taskId, newTitle);
  }
  changeToDoTitle(toDoId, newTitle) {
    const toDo = this.findToDoList(toDoId);
    toDo.changeTitle(newTitle);
  }
  static load(list) {
    const toDoLists = list.map(toDoListObj => ToDoList.load(toDoListObj));
    return new ToDoListCollection(toDoLists);
  }

}

module.exports = {ToDoListCollection};
