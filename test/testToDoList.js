const assert = require('assert');
const {ToDoList} = require('../lib/toDoList');
const {Task} = require('../lib/task');

describe('ToDoList', () => {
  context('load', () => {
    it('should change instance to ToDoList', () => {
      const obj = {id: 'tl-1', title: 'Home Work', tasks: []};
      const toDoList = ToDoList.load(obj);
      assert.deepEqual(toDoList, obj);
      assert.ok(toDoList instanceof ToDoList);
    });
  });

  context('add', () => {
    it('should create and add task if tasks is empty', () => {
      const obj = {id: 'tl-1', title: 'Home Work', tasks: []};
      const toDoList = ToDoList.load(obj);
      toDoList.add('Math');
      const expectedToDoList = new ToDoList('tl-1', 'Home Work', [
        new Task('task-1', 'Math', false)
      ]);
      assert.deepStrictEqual(toDoList, expectedToDoList);
    });

    it('should create and add task if tasks is not empty', () => {
      const obj = {
        id: 'tl-1', title: 'Home Work', tasks: [
          {id: 'task-1', text: 'Math', hasDone: true}
        ]
      };
      const toDoList = ToDoList.load(obj);
      toDoList.add('English');
      const expectedToDoList = new ToDoList('tl-1', 'Home Work', [
        new Task('task-1', 'Math', true),
        new Task('task-2', 'English', false)
      ]);
      assert.deepStrictEqual(toDoList, expectedToDoList);
    });
  });

  context('delete', () => {
    it('should delete task', () => {
      const obj = {
        id: 'tl-1', title: 'Home Work', tasks: [
          {id: 'task-1', text: 'Math', hasDone: true}
        ]
      };
      const toDoList = ToDoList.load(obj);
      toDoList.delete('task-1');
      const expectedToDoList = new ToDoList('tl-1', 'Home Work', []);
      assert.deepStrictEqual(toDoList, expectedToDoList);
    });
  });

  context('toggleStatus', () => {
    it('should toggle the given task status', () => {
      const obj = {
        id: 'tl-1', title: 'Home Work', tasks: [
          {id: 'task-1', text: 'Math', hasDone: false}
        ]
      };
      const toDoList = ToDoList.load(obj);
      toDoList.toggleStatus('task-1');
      const expectedToDoList = new ToDoList('tl-1', 'Home Work', [
        new Task('task-1', 'Math', true)
      ]);
      assert.deepStrictEqual(toDoList, expectedToDoList);
    });
  });
});
