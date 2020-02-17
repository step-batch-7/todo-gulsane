const assert = require('assert');
const {Sessions} = require('../lib/sessions');

describe('Sessions', function () {

  context('addSession()', function () {

    it('should add new session and username', function () {
      const sessions = new Sessions();
      sessions.add('john', '1234');
      const expectedSessions = {sessions: {john: ['1234']}};
      assert.deepEqual(sessions, expectedSessions);
    });

    it('should add new session and to existing username', function () {
      const sessions = new Sessions();
      sessions.add('john', '1234');
      sessions.add('john', '4321');
      const expectedSessions = {sessions: {john: ['1234', '4321']}};
      assert.deepEqual(sessions, expectedSessions);
    });
  });

  context('getUsername()', function () {

    it('should return username if SID is find', function () {
      const sessions = new Sessions();
      sessions.add('john', '1234');
      assert.deepEqual(sessions.getUsername('1234'), 'john');
    });

    it('should return undefined if SID is not found', function () {
      const sessions = new Sessions();
      sessions.add('john', '1234');
      sessions.add('john', '4321');
      assert.deepEqual(sessions.getUsername('1111'), undefined);
    });
  });

  context('remove()', function () {

    it('should return true if it removes given SID', function () {
      const sessions = new Sessions();
      sessions.add('john', '1234');
      sessions.add('john', '4321');
      assert.ok(sessions.remove('1234'));
    });

    it('should return false if SID is not found', function () {
      const sessions = new Sessions();
      sessions.add('john', '1234');
      sessions.add('john', '4321');
      assert.strictEqual(sessions.remove('1111'), false);
    });
  });
});
