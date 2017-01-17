require('babel-register');
const co = require('co');
const start = require('./lib/start');

co(start)
  .catch(console.log);
