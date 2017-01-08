var db, schema, result, user;
db = require('mongorules');
schema = require('./schema.users');

db.addModel('users', {
  schema: schema,
  methods: {
    // `this` == mongorules instance.
    // Generators can be passed if using Koa.
    addUser: function(name, email) {
      var account = {name, email};
      return this.users.insert({ account });
    },
    getUserByEmail: function(email) {
      return this.users.findOne({ 'account.email': email });
    }
  }
});
