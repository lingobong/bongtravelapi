const mongoose = require('mongoose')

const Schema = mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     token: String,
}, { timestamps: true })

Schema.index({ user: 1 }, { unique: true })
Schema.index({ token: 1 }, { unique: true })

module.exports = mongoose.model('UserToken', Schema)