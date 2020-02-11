const assert = require('assert');
const {ToDoListCollection} = require('../lib/toDoListCollection');

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
});
