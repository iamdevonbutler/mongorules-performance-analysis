export function logOperationTime(testName, number, operationName, time) {
  console.log(`>>> ${testName}:  ${number} ${operationName} operations in ${time} seconds`);
}
