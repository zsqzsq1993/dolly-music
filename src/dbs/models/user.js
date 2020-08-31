const mongoose = require('mongoose')

const Schema = mongoose.Schema

const song = new Schema({
  albumname: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  interval: {
    type: Number,
    required: true
  },

  lyric: {
    type: String,
    required: true
  },

  singer: {
    type: String,
    required: true
  },

  songid: {
    type: Number,
    required: true
  },

  songmid: {
    type: String,
    required: true
  },

  songname: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  }
})

const user = new Schema({
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
  },

  songs: {
    requried: true,
    type: [song]
  },

  friends: {
    required: true,
    type: [String]
  }
})

module.exports = mongoose.model('User', user)
