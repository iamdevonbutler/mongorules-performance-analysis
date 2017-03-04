import mongodb from 'mongodb';
import mongorules from 'mongorules';
import schema from './schemas/users.schema.js';
var db;

export function* open () {
  var connection;
  connection = yield mongorules.connect('local', 'mongodb://localhost/mongorules-performance', mongodb);
  mongorules.addDatabase('local', 'mongorules-performance', connection);
  mongorules.addModel('local', 'mongorules-performance', 'users', {
    schema: schema,
    methods: {
      addUser: function* (name, email) {
        var account = {name, email};
        return this.users.insert({ account });
      },
      getUserByEmail: function* (email) {
        return this.users.findOne({ 'account.email': email });
      }
    },
    onError: () => {}
  });
  db = mongorules.getDatabase('local', 'mongorules-performance');
};

export function close() {
  return mongorules.close('local');
};

export function addUser(name, email) {
  return db.users.insert({account: {name, email}});
}

export function addUserNovalidate(name, email) {
  return db.novalidate.users.insert({account: {name, email}});
}

export function removeUsers() {
  return db.users.remove({});
}
