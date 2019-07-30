const mongoose = require('mongoose')

const Schema = mongoose.Schema({
     name: String, // 관광지 명
     journal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'TravelJournal',
     },
     location: {
          type: {
               type: String,
               enum: ['Point'],
               required: true
          },
          coordinates: {
               type: [Number],
               required: true
          }
     }
}, { timestamps: true })

Schema.index({ journal: 1 })
Schema.index({ location: '2dsphere' })
module.exports = mongoose.model('TourlistAttraction', Schema)