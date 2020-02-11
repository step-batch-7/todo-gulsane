const assert = require('assert');
const {ToDoList} = require('../lib/toDoList');

describe('ToDoList', () => {
  context('load', () => {
    it('should change instance to ToDoList', () => {
      const obj = {id: 'tl-1', title: 'Home Work', tasks: []};
      const toDoListObj = ToDoList.load(obj);
      assert.deepEqual(toDoListObj, obj);
      assert.ok(toDoListObj instanceof ToDoList);
    });
  });
});
