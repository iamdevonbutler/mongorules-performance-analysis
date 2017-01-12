import {run} from './run';
import * as mongo from './mongo';
import * as mongorules from './mongorules';
import * as mongoose from './mongoose';

export default function*() {
  var itterations = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;

  // Mongo native (benchmark).
  yield run('Mongo native', mongo, itterations, i => mongo.addUser('jay'+i, `jay@a${i}.com`));

  // Mongorules novalidate (control).
  // yield run('Novalidate mongorules', mongorules, itterations, i => mongorules.addUserNovalidate('jay'+i, `jay@a${i}.com`));

  // Mongorules.
  yield run('Mongorules', mongorules, itterations, i => mongorules.addUser('jay'+i, `jay@a${i}.com`));

  // Mongoose.
  // yield run('Mongoose', mongoose, itterations, i => mongoose.addUser('jay'+i, `jay@a${i}.com`));


};
