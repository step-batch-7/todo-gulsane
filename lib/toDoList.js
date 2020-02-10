class Task {
  constructor(id, title, initialStatus) {
    this.id = id;
    this.title = title;
    this.hasDone = initialStatus;
  }
  toggleStatus() {
    this.hasDone = !this.hasDone;
    return this.hasDone;
  }
  changeTitle(newTitle) {
    this.title = newTitle;
  }
}

class ToDo {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.tasks = [];
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
}

class ToDoList {
  constructor() {
    this.toDoList = [];
  }
  toJSON() {
    return JSON.stringify(this.toDoList);
  }
  get newToDoId() {
    const lastToDo = this.toDoList[this.toDoList.length - 1];
    if (lastToDo) {
      return `${+lastToDo.id + 1}`;
    }
    return '1';
  }
  addNewToDo(title, tasks) {
    const id = this.newToDoId;
    const toDo = new ToDo(id, title);
    tasks.forEach(title => {
      toDo.addNewTask(title, false);
    });
    this.toDoList.push(toDo);
    return toDo;
  }
  addExistingToDo(toDo) {
    this.toDoList.push(toDo);
  }
  getToDo(toDoId) {
    return this.toDoList.find(toDo => toDo.id === toDoId);
  }
  deleteToDo(toDoId) {
    const toDo = this.getToDo(toDoId);
    const indexOfToDo = this.toDoList.findIndex(toDo => toDo.id === toDoId);
    this.toDoList.splice(indexOfToDo, 1);
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
  static load(JSONToDoList) {
    const toDoList = new ToDoList();
    JSONToDoList.forEach(toDoDetail => {
      const { id, title, tasks } = toDoDetail;
      const toDo = new ToDo(id, title);
      tasks.forEach(taskDetail => {
        const { id, title, hasDone } = taskDetail;
        toDo.addExistingTask(id, title, hasDone);
      });
      toDoList.addExistingToDo(toDo);
    });
    return toDoList;
  }
}

module.exports = { ToDoList };
