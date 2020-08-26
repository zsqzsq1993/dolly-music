import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schema = new Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },

  password: {
    required: true,
    type: String,
  },

  email: {
    required: true,
    type: String,
    unique: true
  }
})

module.exports = mongoose.model('User', schema)
