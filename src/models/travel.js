const mongoose = require('mongoose')

const Schema = mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     title: { type: String },
}, { timestamps: true })

Schema.index({ user: 1, title: 1 }, { unique: true })
module.exports = mongoose.model('Travel', Schema)