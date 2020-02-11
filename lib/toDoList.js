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

  addExistingTask(id, title, hasDone) {
    const task = new Task(id, title, hasDone);
    this.tasks.push(task);
  }

  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  deleteTask(taskId) {
    const indexOfTask = this.tasks.findIndex(task => task.id === taskId);
    this.tasks.splice(indexOfTask, 1);
  }

  toggleStatus(taskId) {
    const task = this.getTask(taskId);
    return task.toggleStatus();
  }

  changeTaskTitle(taskId, newTitle) {
    const task = this.getTask(taskId);
    task.changeTitle(newTitle);
  }

  changeTitle(newTitle) {
    this.title = newTitle;
  }

  static load(todoListObj) {
    const {id, title} = todoListObj;
    const tasksObj = todoListObj.tasks;
    const tasks = tasksObj.map(taskObj => Task.load(taskObj));
    return new ToDoList(id, title, tasks);
  }
}

module.exports = {ToDoList};
