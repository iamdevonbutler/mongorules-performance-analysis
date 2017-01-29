import {run} from './runner';
import * as mongo from './mongo';
import * as mongorules from './mongorules';
import * as mongoose from './mongoose';

import mongodb from 'mongodb';
import {defaultDb, connect, addDatabase, addModel} from 'mongorules';
const {Types} = require('mongorules/lib/schema.js');

import test from './test';

module.exports = function*() {
  var cb, itterations;
  itterations = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;

  var connection = yield connect('local', 'mongodb://localhost/mongorules-performance', mongodb);
  var db          = addDatabase('local', 'mongorules-performance');
  addModel('local', 'mongorules-performance', 'users', {
    methods: null,
    schema: {
      name: {
        type: Types.string,
      },
      'account.email': {
        type: Types.string,
      },
      'account.created': {
        type: Types.string,

      },
      friends: {
        required: true,
        minLength: 1,
        type: Types.array(Types.object)
      },
      'friends.fname': {
        type: Types.string,
        required: true,
        notNull: true,
        lowercase: true,
      },
      'friends.lname': {
        type: Types.string,
        required: true,
        notNull: true,
      }
    },
    onError: () => {
      console.log('on error cb hit')
    }
  });

  var result;

  yield db.users.remove({});

  var subdoc = {fname: 'JAY', lname: 'lasname'};
  result = yield db.users.insert({ name: 'jay', account: {email: 'j@j.com', created: '1234' }, friends: [subdoc] });
  result = yield db.users.insert({ name: 'jay', account: {email: 'j@j.com', created: '1234' }, friends: [subdoc] });

  result = yield db.users.find({});
  result = yield result.toArray();
  console.log(result);
  console.log(result[0].friends);
  process.stdout.write('\x07');
  process.exit();



  // Mongo native (benchmark).
  // cb = i => mongo.addUser('jay'+i, `jay@a${i}.com`)
  // yield run('Mongo native - add user', mongo, itterations, cb);

  // Mongorules novalidate (control).
  // cb = i => mongorules.addUserNovalidate('jay'+i, `jay@a${i}.com`);
  // yield run('Novalidate mongorules - add user', mongorules, itterations, cb);

  // Mongorules.
  cb = i => mongorules.addUser('jay'+i, `jay@a${i}.com`)
  yield run('Mongorules - add user', mongorules, itterations, cb);

  // Mongoose.
  // cb = i => mongoose.addUser('jay'+i, `jay@a${i}.com`)
  // yield run('Mongoose - add user', mongoose, itterations, cb);

  // Bell sound...
  process.stdout.write('\x07');



  // mr.addModel('local', 'mongorules-performance', 'users', {
  //   methods: {
  //     insertUser: function*(name, email) {
  //       yield this.users.insert({a:44});
  //       yield this.users.insert({a:45});
  //       let result = yield this.users.find({});
  //       result = yield result.toArray();
  //       return result;
  //     }
  //   }
  // });

};
