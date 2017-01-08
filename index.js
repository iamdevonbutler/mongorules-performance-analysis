require("babel-core").transform("code", {});

const co = require('co');
const db = require('mongorules');
const mongodb = require('mongodb');
const microtime = require('microtime');

require('./model.users.js');

function removeUsers(db) {
  return db.users.remove({});
}

function addUser(db, name, email) {
  var users = db.collection('users');
  return new Promise((resolve, reject) => {
    users.insert({name, email}, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function addUserMongorules(db, name, email) {
  return db.users.insert({account: {name, email}});
}

function* runTestsInSequence(itterations, operation, operationName) {
    var startTime = microtime.now();
    for (let i=0; i<itterations; i++) {
      yield operation(i);
    }
    var time = (microtime.now() - startTime) / 1000000;
    console.log(`>>> ${itterations} ${operationName} in ${time} seconds`);
    return time;
}

function* runTestsInParallel(itterations, operation, operationName) {
    var startTime = microtime.now();
    var promises = [];
    for (let i=0; i<itterations; i++) {
      promises.push(operation(i));
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        var time = (microtime.now() - startTime) / 1000000;
        console.log(`>>> ${itterations} ${operationName} in ${time} seconds`);
        resolve(time);
      });
    });
}

co(function* () {
  var name = 'jay',
      email = 'test@test.com',
      user,
      dbInstance;

  dbInstance = yield db.connect('mongodb://localhost/mongorules-perf-test', mongodb);
  db.addDatabase('mongorules-perf-test', dbInstance);

  // Remove any existing users.
  yield removeUsers(db);

  /*************************/

  var itterations = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;

  var mongoTestCallback = (i) => addUser(dbInstance, 'jay'+i, `jay@a${i}.com`);
  var mongorulesTestCallback = (i) => addUserMongorules(db, 'jay'+i, `jay@a${i}.com`);

  // Regular.
  var mongoTime = yield runTestsInSequence(itterations, mongoTestCallback, 'mongo inserts');
  // yield runTestsInParallel(itterations, mongoTestCallback, 'mongo inserts');

  // Mongorules.
  var mongorulesTime = yield runTestsInSequence(itterations, mongorulesTestCallback, 'mongrules inserts');
  // yield runTestsInParallel(itterations, mongorulesTestCallback, 'mongrules inserts');

  console.log(`>>> Time inc ${((mongorulesTime - mongoTime) / mongoTime)*100}%`);

  // Clean up.
  yield removeUsers(db);
  db.close();

}).catch(e => console.log(e));
