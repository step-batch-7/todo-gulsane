const assert = require('assert');
const {UserCollection} = require('../lib/userCollection');

describe('UserCollection', () => {

  context('load()', () => {
    it('should create UserCollection object', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      const expUserCollection = {
        userList: [
          {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
        ]
      };

      assert.deepEqual(userCollection, expUserCollection);
      assert.ok(userCollection instanceof UserCollection);
    });
  });

  context('toJSON()', () => {
    it('should return stringify list of user', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      const expectedString = JSON.stringify([
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ]);

      assert.strictEqual(userCollection.toJSON(), expectedString);
    });
  });

  context('addUser()', () => {
    it('should add the user in the list of userCollection', () => {
      const userList = [];
      const userCollection = UserCollection.load(userList);
      userCollection.addUser(
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      );
      const expectedString = JSON.stringify([
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ]);

      assert.strictEqual(userCollection.toJSON(), expectedString);
    });
  });

  context('save()', () => {

    it('should writer gets correct path and json', () => {
      const expectedString = JSON.stringify([
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ]);

      const writer = function (path, userData) {
        assert.strictEqual(path, 'path');
        assert.strictEqual(userData, expectedString);
      };

      const userWriter = writer.bind(null, 'path');

      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      userCollection.save(userWriter);
    });
  });

  context('verifyUser()', () => {
    it('should return false if username not found', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      assert.strictEqual(userCollection.verifyUser('armaan', '1234'), false);
    });

    it('should return false if password not matched', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      assert.strictEqual(userCollection.verifyUser('gulshane', 'hel12'), false);
    });

    it('should return true if user is valid', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      assert.strictEqual(userCollection.verifyUser('gulshane', '1234'), true);
    });
  });

  context('getUserFullName()', () => {
    it('should return full name of user for given username', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      const actualName = userCollection.getUserFullName('gulshane');

      assert.strictEqual(actualName, 'Gulshan Kumar');
    });
  });

  context('isAvailable()', () => {
    it('should return true if username is not in the list', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      assert.ok(userCollection.isAvailable('john'));
    });

    it('should return false if username is in the list', () => {
      const userList = [
        {name: 'Gulshan Kumar', username: 'gulshane', password: '1234'}
      ];
      const userCollection = UserCollection.load(userList);
      assert.strictEqual(userCollection.isAvailable('gulshane'), false);
    });
  });
});
