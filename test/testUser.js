const assert = require('assert');
const {User} = require('../lib/user');

describe('User', () => {

  context('load()', () => {
    it('should create User object', () => {
      const userDetail = {
        name: 'Gulshan Kumar', username: 'gulshane', password: '1234'
      };
      const user = User.load(userDetail);
      const expectedUser = {
        name: 'Gulshan Kumar', username: 'gulshane', password: '1234'
      };

      assert.deepEqual(user, expectedUser);
      assert.ok(user instanceof User);
    });
  });
});
