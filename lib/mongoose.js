const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // to supress warning.
var UsersModel = {};

export function* open() {
  yield mongoose.connect('mongodb://localhost/mongorules-perf-test');

  var Users = new mongoose.Schema({
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
  UsersModel = mongoose.model('users', Users);
};

export function close() {
  return mongoose.connection.close();
};

export function addUser(name, email) {
  var user = new UsersModel();
  user.name = name;
  user.email = email;
  return user.save();
};

export function removeUsers() {
  return UsersModel.remove({});
};
