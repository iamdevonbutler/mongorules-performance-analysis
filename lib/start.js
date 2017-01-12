import {logOperationTime} from './log';
import {runInParallel, runInSeries} from './run';
import * as mongo from './mongoNative';
import * as mongorules from './mongorules';

export default function*() {
  var itterations = process.argv[2] ? parseInt(process.argv[2], 10) : 10000;

  // Mongo native (benchmark).
  // yield mongo.open();
  // var mongoTime = yield runInSeries(itterations, i => mongo.addUser('jay'+i, `jay@a${i}.com`));
  // yield mongo.removeUsers()
  // yield mongo.close();
  // logOperationTime('Mongo native', itterations, 'insert', mongoTime);

  // Mongorules.
  yield mongorules.open();
  var mongorulesTime = yield runInSeries(itterations, i => mongorules.addUser('jay'+i, `jay@a${i}.com`));
  yield mongorules.removeUsers()
  yield mongorules.close();
  logOperationTime('Mongorules', itterations, 'insert', mongorulesTime);


  // var novalidateTestCallback = (i) => addUserMongorules(db, 'jay'+i, `jay@a${i}.com`, true);
  // var mongorulesTestCallback = (i) => addUserMongorules(db, 'jay'+i, `jay@a${i}.com`);

  // var mongoTime = yield runInSeries(itterations, mongoTestCallback, 'mongo inserts');
  // yield removeUsersMongorules(db);

  // Novalidate.
  // var novalidateTime = yield runInSeries(itterations, novalidateTestCallback, 'novalidate inserts');
  // yield runInParallel(itterations, mongorulesTestCallback, 'mongrules inserts');
  // yield removeUsersMongorules(db);

  // Mongorules.
  // var mongorulesTime = yield runInSeries(itterations, mongorulesTestCallback, 'mongrules inserts');
  // yield runInParallel(itterations, mongorulesTestCallback, 'mongrules inserts');
  // yield removeUsersMongorules(db);


  // var mongooseTime = yield runInSeries(itterations, () => {
  //   var user = new UsersModel();
  //   user.name = name;
  //   user.email = email;
  //   return user.save();
  // }, 'mongoose inserts');

  // Results.
  // console.log(`>>> Time change w/ mongorules ${((mongorulesTime - mongoTime) / mongoTime)*100}%`);
  // console.log(`>>> Time change w/ novalidate ${((novalidateTime - mongoTime) / mongoTime)*100}%`);
  // console.log(`>>> Time change w/ mongoose ${((mongooseTime - mongoTime) / mongoTime)*100}%`);


};
