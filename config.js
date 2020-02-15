const {env} = require('process');

const config = {
  DATA_STORE: env.DATA_STORE,
  USER_STORE: env.USER_STORE
};

module.exports = {config};
