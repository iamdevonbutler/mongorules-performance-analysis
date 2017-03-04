require('babel-register');
const co = require('co');

const start = require('./lib/start');
const test = require('./lib/test');

const run = process.argv[2] === 'test' ? test : start;

co(run)
  .catch(console.log);
