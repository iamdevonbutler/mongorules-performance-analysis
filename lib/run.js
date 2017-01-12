import microtime from 'microtime';
import {logOperationTime} from './log';

export function* run(name, obj, itterations, func) {
  var time;
  yield obj.open();
  time = yield runInSeries(itterations, func);
  logOperationTime(name, itterations, 'insert', time);
  yield obj.removeUsers()
  yield obj.close();
};

function* runInSeries(itterations, callback) {
  var startTime, time;
  startTime = microtime.now();
  for (let i=0; i<itterations; i++) {
    yield callback.call(null, i);
  }
  time = (microtime.now() - startTime) / 1000000;
  return time;
}

function runInParallel(itterations, callback) {
  var startTime = microtime.now();
  var promises = [];
  for (let i=0; i<itterations; i++) {
    promises.push(callback(i));
  }
  return new Promise((resolve, reject) => {
    Promise.all(promises).then(() => {
      var time = (microtime.now() - startTime) / 1000000;
      resolve(time);
    });
  });
}
