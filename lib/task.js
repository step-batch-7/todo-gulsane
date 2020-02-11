class Task {
  constructor (id, text, hasDone) {
    this.id = id;
    this.text = text;
    this.hasDone = hasDone;
  }
  toggleStatus() {
    this.hasDone = !this.hasDone;
    return this.hasDone;
  }
  changeTitle(newTitle) {
    this.text = newTitle;
  }

  static load(taskObj) {
    const {id, text, hasDone} = taskObj;
    return new Task(id, text, hasDone);
  }
}

module.exports = {Task};
