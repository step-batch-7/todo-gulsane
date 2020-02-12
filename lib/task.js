class Task {
  constructor (id, text, hasDone) {
    this.id = id;
    this.text = text;
    this.hasDone = hasDone;
  }

  toggleDoneStatus() {
    this.hasDone = !this.hasDone;
  }

  changeText(newText) {
    this.text = newText;
  }

  static load(taskObj) {
    const {id, text, hasDone} = taskObj;
    return new Task(id, text, hasDone);
  }
}

module.exports = {Task};
