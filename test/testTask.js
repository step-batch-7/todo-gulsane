const assert = require('assert');
const {Task} = require('../lib/task');

describe('Task', () => {
  context('load', () => {
    it('should change instance to Task', () => {
      const obj = {id: 'task-1', text: 'Math', hasDone: false};
      const taskObj = Task.load(obj);
      assert.deepEqual(taskObj, obj);
      assert.ok(taskObj instanceof Task);
    });
  });
});
