const redis = require('redis');
const { env } = process;

const redisUrl = env.REDIS_URL;

const loadUserList = function (app) {
  const client = redis.createClient(redisUrl);
  client.get('userList', function (err, data) {
    if (err) {
      throw err;
    } else {
      app.commentsDetail = data;
    }
  });
  client.quit();
};

const saveUserList = function (userList) {
  const client = redis.createClient(redisUrl);
  client.set('userList', userList, function (err) {
    if (err) {
      throw err;
    }
  });
  client.quit();
};

const loadUserData = function (app) {
  const client = redis.createClient(redisUrl);
  client.get('userData', function (err, data) {
    if (err) {
      throw err;
    } else {
      app.commentsDetail = data;
    }
  });
  client.quit();
};

const saveUserData = function (userData) {
  const client = redis.createClient(redisUrl);
  client.set('userData', userData, function (err) {
    if (err) {
      throw err;
    }
  });
  client.quit();
};

module.exports = { loadUserList, saveUserList, loadUserData, saveUserData };
