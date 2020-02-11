const assert = require('assert');
const {ToDoListCollection} = require('../lib/toDoListCollection');
const {ToDoList} = require('../lib/toDoList');
const {Task} = require('../lib/task');

describe('ToDoListCollection', () => {
  context('load', () => {
    it('should change instance to ToDoListCollection', () => {
      const list = [{id: 'tl-1', title: 'Home Work', tasks: []}];
      const toDoListCollection = ToDoListCollection.load(list);
      assert.deepEqual(toDoListCollection, {toDoLists: list});
      assert.ok(toDoListCollection instanceof ToDoListCollection);
    });
  });

  context('toJSON', () => {
    it('should return stringify toDoLists', () => {
      const list = [{id: 'tl-1', title: 'Home Work', tasks: []}];
      const toDoListCollection = ToDoListCollection.load(list);
      const expectedString = JSON.stringify(list);
      assert.strictEqual(toDoListCollection.toJSON(), expectedString);
    });
  });

  context('lastToDoList', () => {
    it('should return lastToDoList if toDoLists is not empty', () => {
      const list = [
        {id: 'tl-1', title: 'Home Work', tasks: []},
        {id: 'tl-2', title: 'Class Work', tasks: []}
      ];
      const toDoListCollection = ToDoListCollection.load(list);
      const expectedToDoList = {id: 'tl-2', title: 'Class Work', tasks: []};
      assert.deepEqual(toDoListCollection.lastToDoList, expectedToDoList);
    });

    it('should return lastToDoList if toDoLists is empty', () => {
      const list = [];
      const toDoListCollection = ToDoListCollection.load(list);
      const expectedToDoList = undefined;
      assert.strictEqual(toDoListCollection.lastToDoList, expectedToDoList);
    });
  });

  context('add', () => {
    it('should create toDoList and add if toDoLists is empty', () => {
      const toDoListCollection = ToDoListCollection.load([]);
      toDoListCollection.add('Home Work');
      const list = [new ToDoList('tl-1', 'Home Work', [])];
      assert.deepStrictEqual(toDoListCollection.toDoLists, list);
    });

    it('should create toDoList and add if toDoLists is not empty', () => {
      const availableList = [{id: 'tl-1', title: 'Home Work', tasks: []}];
      const toDoListCollection = ToDoListCollection.load(availableList);
      toDoListCollection.add('Class Work');
      const list = [
        new ToDoList('tl-1', 'Home Work', []),
        new ToDoList('tl-2', 'Class Work', [])
      ];
      assert.deepStrictEqual(toDoListCollection.toDoLists, list);
    });
  });

  context('delete', () => {
    it('should delete toDoList', () => {
      const availableList = [
        {id: 'tl-1', title: 'Home Work', tasks: []},
        {id: 'tl-2', title: 'Class Work', tasks: []}
      ];
      const toDoListCollection = ToDoListCollection.load(availableList);
      toDoListCollection.delete('tl-1');
      const list = [new ToDoList('tl-2', 'Class Work', [])];
      assert.deepStrictEqual(toDoListCollection.toDoLists, list);
    });
  });

  context('addTask', () => {
    it('should delete toDoList', () => {
      const availableList = [
        {id: 'tl-1', title: 'Home Work', tasks: []}
      ];
      const toDoListCollection = ToDoListCollection.load(availableList);
      toDoListCollection.addTask('tl-1', 'Maths');
      const expectedToDoList = new ToDoList('tl-1', 'Home Work', [
        new Task('task-1', 'Maths', false)
      ]);
      const list = [expectedToDoList];
      assert.deepStrictEqual(toDoListCollection.toDoLists, list);
    });
  });
});
