const {Task} = require('./task');

class ToDoList {
  constructor (id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  get lastTask() {
    const totalTasks = this.tasks.length;
    return this.tasks[totalTasks - 1];
  }

  getNewTaskId() {
    const lastTask = this.lastTask;
    const idNum = lastTask ? +lastTask.id.split('-').pop() : 0;
    return `task-${idNum + 1}`;
  }

  add(text) {
    const id = this.getNewTaskId();
    const task = new Task(id, text, false);
    this.tasks.push(task);
  }

  delete(taskId) {
    const indexOfTask = this.tasks.findIndex(task => task.id === taskId);
    this.tasks.splice(indexOfTask, 1);
  }

  findTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  toggleStatus(taskId) {
    const task = this.findTask(taskId);
    task.toggleDoneStatus();
  }

  changeTitle(newTitle) {
    this.title = newTitle;
  }

  changeTaskText(taskId, newText) {
    const task = this.findTask(taskId);
    task.changeText(newText);
  }

  static load(todoListObj) {
    const {id, title} = todoListObj;
    const tasksObj = todoListObj.tasks;
    const tasks = tasksObj.map(taskObj => Task.load(taskObj));
    return new ToDoList(id, title, tasks);
  }
}

module.exports = {ToDoList};
