const mongoose = require('mongoose')

const Schema = mongoose.Schema({
     snsId: String, // 'naver/~~~~', 'google/~~~'식으로 한다
     nickname: String, // `n${id}`, `g${id}` 식으로 한다
}, { timestamps: true })

Schema.index({ snsId: 1 }, { unique: true })
Schema.index({ nickname: 1 }, { unique: true })

module.exports = mongoose.model('User', Schema)