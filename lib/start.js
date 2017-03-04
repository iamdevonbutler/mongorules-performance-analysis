import {run} from './runner';
import * as mongo from './mongo';
import * as mongorules from './mongorules';
import * as mongoose from './mongoose';

module.exports = function*() {
  var cb, itterations;
  itterations = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;

  // Mongo native (benchmark).
  cb = i => mongo.addUser('jay'+i, `jay@a${i}.com`)
  yield run('Mongo native - add user', mongo, itterations, cb);

  // Mongorules novalidate (control).
  cb = i => mongorules.addUserNovalidate('jay'+i, `jay@a${i}.com`);
  yield run('Novalidate mongorules - add user', mongorules, itterations, cb);

  // Mongorules.
  cb = i => mongorules.addUser('jay'+i, `jay@a${i}.com`)
  yield run('Mongorules - add user', mongorules, itterations, cb);

  // Mongoose.
  cb = i => mongoose.addUser('jay'+i, `jay@a${i}.com`)
  yield run('Mongoose - add user', mongoose, itterations, cb);

  // Bell sound...
  process.stdout.write('\x07');

};
