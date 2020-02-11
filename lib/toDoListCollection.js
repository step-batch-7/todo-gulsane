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

  toJSON() {
    return JSON.stringify(this.toDoLists);
  }

  findToDoList(toDoListId) {
    return this.toDoLists.find(toDoList => toDoList.id === toDoListId);
  }

  deleteToDoTask(toDoId, taskId) {
    const toDo = this.findToDoList(toDoId);
    toDo.deleteTask(taskId);
  }
  addNewTaskToToDo(toDoId, taskTitle) {
    const toDo = this.findToDoList(toDoId);
    const hasDone = false;
    return toDo.addNewTask(taskTitle, hasDone);
  }
  toggleTaskStatus(toDoId, taskId) {
    const toDo = this.findToDoList(toDoId);
    return toDo.toggleStatus(taskId);
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
