const assert = require('assert');
const {UsersDataStore} = require('../lib/usersDataStore');

describe('UsersDataStore', function () {

  context('getUserData()', () => {
    it('should call reader with params and returns given parsed json', () => {
      const reader = function (path, encoding) {
        assert.strictEqual(path, 'path');
        assert.strictEqual(encoding, 'utf8');
        return '{"john":[]}';
      };

      const writer = () => {};

      const usersDataStore = new UsersDataStore(reader, writer, 'path');
      usersDataStore.initialize();
      assert.deepStrictEqual(usersDataStore.getUserData('john'), []);
    });
  });

  context('updateUserData()', () => {
    it('should write updated new user data', () => {
      const reader = function (path, encoding) {
        assert.strictEqual(path, 'path');
        assert.strictEqual(encoding, 'utf8');
        return '';
      };

      let calledCount = 0;
      const writer = function (path, content) {
        assert.strictEqual(path, 'path');
        assert.strictEqual(content,
          '{"john":[{"title":"Home","id":"tl-1","tasks":[]}]}'
        );
        calledCount++;
      };

      const usersDataStore = new UsersDataStore(reader, writer, 'path');
      usersDataStore.initialize();
      usersDataStore.updateUserData('john', [
        {title: 'Home', id: 'tl-1', tasks: []}
      ]);
      assert.strictEqual(calledCount, 1);
    });

    it('should write updated existing user data', () => {
      const reader = function (path, encoding) {
        assert.strictEqual(path, 'path');
        assert.strictEqual(encoding, 'utf8');
        return '{"john":[]}';
      };

      let calledCount = 0;
      const writer = function (path, content) {
        assert.strictEqual(path, 'path');
        assert.strictEqual(content,
          '{"john":[{"title":"Home","id":"tl-1","tasks":[]}]}'
        );
        calledCount++;
      };

      const usersDataStore = new UsersDataStore(reader, writer, 'path');
      usersDataStore.initialize();
      usersDataStore.updateUserData('john', [
        {title: 'Home', id: 'tl-1', tasks: []}
      ]);
      assert.strictEqual(calledCount, 1);
    });

  });
});

