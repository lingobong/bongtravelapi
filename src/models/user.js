const mongoose = require('mongoose')

const Schema = mongoose.Schema({
     naverId: String, // 
     nickname: String, // 

     birth: Number, // 1996
     gender: Number, // 
}, { timestamps: true })

module.exports = mongoose.model('User', Schema)