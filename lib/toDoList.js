const {Task} = require('./task');

class ToDoList {
  constructor (id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  get newTaskId() {
    const lastTask = this.tasks[this.tasks.length - 1];
    if (lastTask) {
      return `${this.id}_${+lastTask.id.split('_').pop() + 1}`;
    }
    return `${this.id}_1`;
  }

  addNewTask(title, hasDone) {
    const id = this.newTaskId;
    const task = new Task(id, title, hasDone);
    this.tasks.push(task);
    return task;
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
