const mongorules = require('mongorules');
const mongodb = require('mongodb');
const schema = require('./schemas/users.schema');
const {Types} = require('mongorules');

module.exports = function*() {

  var connection = yield mongorules.connect('local', 'mongodb://localhost/mongorules-testing', mongodb);
  var db = mongorules.addDatabase('local', 'mongorules-testing', connection);
  mongorules.addModels('local', 'mongorules-testing', {
    users: {
      schema: {
        friends: {
          type: Types.string,
        },
      },
      onError: (errors, info) => {

      }
    }
  });
  mongorules.addGlobalErrorHandler((errors, info, localHandlerExists) => {

  });

  // House keeping.
  var user = yield db.users.remove({});



  // var db = mongorules.getConnection('local');
  var x = yield db.stats()
  console.log(x);





  // House keeping.
  yield db.users.remove({});
  yield mongorules.close('local');

  // Bell sound...
  process.stdout.write('\x07');

};
