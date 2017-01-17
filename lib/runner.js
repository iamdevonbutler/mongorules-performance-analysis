import microtime from 'microtime';
import {logOperationTime} from './log';

export function* run(title, obj, itterations, func, inSeries = true) {
  var time;
  yield obj.open();
  if (inSeries) {
    time = yield runInSeries(itterations, func);
  }
  else {
    time = yield runInParallel(itterations, func);
  }
  logOperationTime(title, itterations, time);
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
  return Promise.all(promises).then(() => {
    var time = (microtime.now() - startTime) / 1000000;
    return time;
  });
}
