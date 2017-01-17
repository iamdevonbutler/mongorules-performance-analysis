export function logOperationTime(title, itterations, time) {
  console.log(`>>> ${title}: ${Math.round(itterations/time)} ops/sec (${itterations} itterations)`);
}

// Results.
// console.log(`>>> Time change w/ mongorules ${((mongorulesTime - mongoTime) / mongoTime)*100}%`);
// console.log(`>>> Time change w/ novalidate ${((novalidateTime - mongoTime) / mongoTime)*100}%`);
// console.log(`>>> Time change w/ mongoose ${((mongooseTime - mongoTime) / mongoTime)*100}%`);
