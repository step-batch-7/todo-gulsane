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

  toJSON() {
    return JSON.stringify(this.toDoLists);
  }

  getToDo(toDoId) {
    return this.toDoLists.find(toDo => toDo.id === toDoId);
  }
  deleteToDo(toDoId) {
    const toDo = this.getToDo(toDoId);
    const indexOfToDo = this.toDoLists.findIndex(toDo => toDo.id === toDoId);
    this.toDoLists.splice(indexOfToDo, 1);
    return toDo;
  }
  deleteToDoTask(toDoId, taskId) {
    const toDo = this.getToDo(toDoId);
    toDo.deleteTask(taskId);
  }
  addNewTaskToToDo(toDoId, taskTitle) {
    const toDo = this.getToDo(toDoId);
    const hasDone = false;
    return toDo.addNewTask(taskTitle, hasDone);
  }
  toggleTaskStatus(toDoId, taskId) {
    const toDo = this.getToDo(toDoId);
    return toDo.toggleStatus(taskId);
  }
  changeTaskTitle(toDoId, taskId, newTitle) {
    const toDo = this.getToDo(toDoId);
    toDo.changeTaskTitle(taskId, newTitle);
  }
  changeToDoTitle(toDoId, newTitle) {
    const toDo = this.getToDo(toDoId);
    toDo.changeTitle(newTitle);
  }
  static load(list) {
    const toDoLists = list.map(toDoListObj => ToDoList.load(toDoListObj));
    return new ToDoListCollection(toDoLists);
  }

}

module.exports = {ToDoListCollection};
