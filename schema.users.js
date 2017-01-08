module.exports = {
  "account.email": {
    required: true,
    notNull: true,
    type: 'string',
    minLength: 3,
    lowercase: true,
    trim: true,
    // validate: function(value) {...}
  },
  "account.name": {
    type: 'string',
    lowercase: true,
    trim: true
  },
  "created": {
    type: 'date',
    dateFormat: 'iso8601',
    default: new Date()
  }
}
