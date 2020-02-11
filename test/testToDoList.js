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
      const expectedTasks = [new Task('task-1', 'Math', false)];
      assert.deepStrictEqual(toDoList.tasks, expectedTasks);
    });

    it('should create and add task if tasks is not empty', () => {
      const obj = {
        id: 'tl-1', title: 'Home Work', tasks: [
          {id: 'task-1', text: 'Math', hasDone: true}
        ]
      };
      const toDoList = ToDoList.load(obj);
      toDoList.add('English');
      const expectedTasks = [
        new Task('task-1', 'Math', true),
        new Task('task-2', 'English', false)
      ];
      assert.deepStrictEqual(toDoList.tasks, expectedTasks);
    });
  });
});
