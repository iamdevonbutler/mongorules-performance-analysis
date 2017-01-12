import microtime from 'microtime';

module.exports.runInSeries =  function*(itterations, callback) {
  var startTime, time;
  startTime = microtime.now();
  for (let i=0; i<itterations; i++) {
    yield callback.call(null, i);
  }
  time = (microtime.now() - startTime) / 1000000;
  return time;
}

module.exports.runInParallel = function(itterations, callback) {
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
