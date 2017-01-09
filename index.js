require("babel-core").transform("code", {});

const co = require('co');
const db = require('mongorules');
const mongodb = require('mongodb');
const microtime = require('microtime');
const mongoose = require('mongoose');

require('./model.users.js');

function removeUsers(db) {
  return db.users.remove({});
}

function addUser(db, name, email) {
  if (name && Object.prototype.toString.call(name) !== '[object String]') return;
  name = name.toLowerCase().trim();

  if (!email || email === null) return;
  if (Object.prototype.toString.call(email) !== '[object String]' || email.length < 3) return;
  email = email.toLowerCase().trim();

  var users = db.collection('users');
  return new Promise((resolve, reject) => {
    users.insert({name, email, created: new Date()}, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

function addUserMongorules(db, name, email, novalidate = false) {
  if (novalidate) {
    return db.users.novalidate.insert({account: {name, email}});
  }
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
  var novalidateTestCallback = (i) => addUserMongorules(db, 'jay'+i, `jay@a${i}.com`, true);
  var mongorulesTestCallback = (i) => addUserMongorules(db, 'jay'+i, `jay@a${i}.com`);

  // Regular.
  var mongoTime = yield runTestsInSequence(itterations, mongoTestCallback, 'mongo inserts');
  // yield runTestsInParallel(itterations, mongoTestCallback, 'mongo inserts');
  yield removeUsers(db);

  // Novalidate.
  var novalidateTime = yield runTestsInSequence(itterations, novalidateTestCallback, 'novalidate inserts');
  // yield runTestsInParallel(itterations, mongorulesTestCallback, 'mongrules inserts');
  yield removeUsers(db);

  // Mongorules.
  var mongorulesTime = yield runTestsInSequence(itterations, mongorulesTestCallback, 'mongrules inserts');
  // yield runTestsInParallel(itterations, mongorulesTestCallback, 'mongrules inserts');
  yield removeUsers(db);

  // Mongoose.
  mongoose.connect('mongodb://localhost/mongorules-perf-test');
  mongoose.Promise = global.Promise; // to supress error.
  var Schema = mongoose.Schema;

  var Users = new Schema({
    email: {
      type: String,
      min: 3,
    },
    name: {
      type: String,
      min: 3,
    },
    created: {
      type: Date,
      default: new Date,
    }
  });
  Users.path('email').set(function (v) {
    return v.toLowerCase().trim();
  });
  Users.path('name').set(function (v) {
    return v.toLowerCase().trim();
  });
  var UsersModel = mongoose.model('users', Users);
  var mongooseTime = yield runTestsInSequence(itterations, () => {
    var user = new UsersModel();
    user.name = name;
    user.email = email;
    return user.save();
  }, 'mongoose inserts');
  yield removeUsers(db);


  // Results.
  console.log(`>>> Time change w/ mongorules ${((mongorulesTime - mongoTime) / mongoTime)*100}%`);
  console.log(`>>> Time change w/ novalidate ${((novalidateTime - mongoTime) / mongoTime)*100}%`);
  console.log(`>>> Time change w/ mongoose ${((mongooseTime - mongoTime) / mongoTime)*100}%`);

  // Clean up.
  db.close();
  mongoose.connection.close()

}).catch(e => console.log(e));
