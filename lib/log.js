export function logOperationTime(testName, number, operationName, time) {
  console.log(`>>> ${testName}: ${number} ${operationName} operations in ${time} seconds`);
}

// Results.
// console.log(`>>> Time change w/ mongorules ${((mongorulesTime - mongoTime) / mongoTime)*100}%`);
// console.log(`>>> Time change w/ novalidate ${((novalidateTime - mongoTime) / mongoTime)*100}%`);
// console.log(`>>> Time change w/ mongoose ${((mongooseTime - mongoTime) / mongoTime)*100}%`);
