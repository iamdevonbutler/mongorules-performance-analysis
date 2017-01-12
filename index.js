require('babel-core/register');
const co = require('co');
co(require('./lib/start.js').default).catch(console.log);
