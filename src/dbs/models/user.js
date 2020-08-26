const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
  username: {
    required: true,
    type: String,
    unique: true
  },

  password: {
    required: true,
    type: String
  },

  email: {
    required: true,
    type: String,
    unique: true
  }
})

const User = mongoose.model('User', schema)
module.exports = User
