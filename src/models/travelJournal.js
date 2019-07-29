const mongoose = require('mongoose')

const Schema = mongoose.Schema({
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     travel: { type: mongoose.Schema.Types.ObjectId, ref: 'Travel' },
     title: String,
     description: String,
     date: Date,
     pictures: Array,
     latitude: Number,
     longitude: Number,
}, { timestamps: true })

Schema.index({ user: 1, travel: 1 })

module.exports = mongoose.model('TravelJournal', Schema)