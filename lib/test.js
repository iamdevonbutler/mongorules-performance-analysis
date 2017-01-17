import {db} from 'mongorules';

export default function*() {

  var result = yield db.users.insert({a:3});
  var result = yield db.users.insert({a:4});
  var result = yield db.users.find({});
  result = yield result.toArray();
  console.log(result);

}
