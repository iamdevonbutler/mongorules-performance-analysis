const {Types} = require('mongorules');

module.exports = {
  "account.email": {
    required: true,
    notNull: true,
    type: Types.string,
    minLength: 3,
    lowercase: true,
    trim: true,
    // validate: function(value) {...}
  },
  "account.name": {
    type: Types.string,
    lowercase: true,
    trim: true
  },
  "created": {
    type: Types.date,
    default: new Date()
  }
}
