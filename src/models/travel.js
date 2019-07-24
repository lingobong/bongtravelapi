const mongoose = require('mongoose')

const Schema = mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     title: String,
}, { timestamps: true })

module.exports = mongoose.model('Travel', Schema)