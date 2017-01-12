const {MongoClient} = require('mongodb');
var db = {};

export function open() {
  return new Promise((resolve, reject) => {
    MongoClient.connect('mongodb://localhost/mongorules-perf-test', function(err, _db) {
      if (err) reject(err);
      db = _db;
      resolve(db);
    });
  });
};

export function close() {
  return db.close();
};

export function addUser(name, email) {
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
};

export function removeUsers() {
  var users;
  users = db.collection('users');
  return users.remove({});
};
