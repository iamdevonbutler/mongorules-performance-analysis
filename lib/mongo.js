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
  if (!name || typeof name !== 'string') return;
  name = name.toLowerCase().trim();

  if (!email || typeof email !== 'string' || email.length < 3) return;
  email = email.toLowerCase().trim();

  var users = db.collection('users');
  return users.insert({name, email, created: new Date()});
};

export function removeUsers() {
  var users;
  users = db.collection('users');
  return users.remove({});
};
