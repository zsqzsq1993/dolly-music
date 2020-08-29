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

const songs = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  songs: {
    type: [song],
    required: true
  }
})

module.exports = mongoose.model('Songs', songs)
