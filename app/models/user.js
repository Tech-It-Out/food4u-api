const mongoose = require('mongoose')
const { capitalize } = require('../../lib/util')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    set: capitalize
  },
  surname: {
    type: String,
    set: capitalize
  },
  street: {
    type: String
  },
  apartment: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  token: String
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
