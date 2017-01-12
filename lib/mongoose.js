const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // to supress warning.

module.exports.initConnection = function*() {
  mongoose.connect('mongodb://localhost/mongorules-perf-test');
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
};

module.exports.closeConnection = function*() {
  mongoose.connection.close();
};
