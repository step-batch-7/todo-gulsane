const assert = require('assert');
const {Task} = require('../lib/task');

describe('Task', () => {
  context('load', () => {
    it('should change instance to Task', () => {
      const obj = {id: 'task-1', text: 'Math', hasDone: false};
      const task = Task.load(obj);
      assert.deepEqual(task, obj);
      assert.ok(task instanceof Task);
    });
  });

  context('toggleDoneStatus', () => {
    it('should toggle the hasDone value', () => {
      const obj = {id: 'task-1', text: 'Math', hasDone: false};
      const task = Task.load(obj);
      task.toggleDoneStatus();
      const expectedTask = new Task('task-1', 'Math', true);
      assert.deepStrictEqual(task, expectedTask);
    });
  });
});
