console.log(4);
import {run} from './runner';
import * as mongo from './mongo';
import * as mongorules from './mongorules';
import * as mongoose from './mongoose';

import mongodb from 'mongodb';
import {defaultDb, connect, addDatabase} from 'mongorules';

import test from './test';

module.exports = function*() {
  var itterations = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;




  // var connection1 = yield connect('local', 'mongodb://localhost/mongorules-performance', mongodb);
  // var db1         = addDatabase('local', 'mongorules-performance-1');
  // setDefaultDb('local', 'mongorules-performance-1');
  // yield* test();

  // yield db1.users.insert({a:1})
  // yield db1.users.insert({a:1}, cache())


  // Mongo native (benchmark).
  yield run('Mongo native - add user', mongo, itterations,
    i => mongo.addUser('jay'+i, `jay@a${i}.com`));

  // Mongorules novalidate (control).
  yield run('Novalidate mongorules - add user', mongorules, itterations,
    i => mongorules.addUserNovalidate('jay'+i, `jay@a${i}.com`));

  // Mongorules.
  yield run('Mongorules - add user', mongorules, itterations,
    i => mongorules.addUser('jay'+i, `jay@a${i}.com`));

  // Mongoose.
  // yield run('Mongoose - add user', mongoose, itterations,
    // i => mongoose.addUser('jay'+i, `jay@a${i}.com`));

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
