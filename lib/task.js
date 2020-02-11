class Task {
  constructor (id, text, doneStatus) {
    this.id = id;
    this.text = text;
    this.hasDone = doneStatus;
  }
  toggleStatus() {
    this.hasDone = !this.hasDone;
    return this.hasDone;
  }
  changeTitle(newTitle) {
    this.text = newTitle;
  }

  static load(taskObj) {
    const {id, text, doneStatus} = taskObj;
    return new Task(id, text, doneStatus);
  }
}

module.exports = {Task};
