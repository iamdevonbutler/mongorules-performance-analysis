const db = require('mongorules');
import mongodb from 'mongodb';
import schema from './schemas/users.schema.js';

export function* open () {
  var dbInstance;
  dbInstance = yield db.connect('mongodb://localhost/mongorules-perf-test', mongodb);
  db.addDatabase('mongorules-perf-test', dbInstance);

  db.addModel('users', {
    schema: schema,
    methods: {
      // `this` == mongorules instance.
      // Generators can be passed if using Koa.
      addUser: function(name, email) {
        var account = {name, email};
        return this.users.insert({ account });
      },
      getUserByEmail: function(email) {
        return this.users.findOne({ 'account.email': email });
      }
    }
  });
};

export function close() {
  return db.close();
};

export function addUser(name, email) {
  return db.users.insert({account: {name, email}});
}

export function addUserNovalidate(name, email) {
  return db.users.novalidate.insert({account: {name, email}});
}

export function removeUsers() {
  return db.users.remove({});
}
