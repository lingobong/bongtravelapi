const express = require('express')
const mongoose = require('mongoose')
const models = require('../../models')

const router = express.Router()

// /travel/:travelId/journal

router.get('/:travelId/journals', async (req, res) => {
     let travelJournals = await models.travelJournal.aggregate([
          {
               $match: {
                    travel: mongoose.Types.ObjectId(req.params.travelId)
               }
          },
          {
               $sort: {
                    date: 1,
                    updatedAt: 1,
               },
          },
          {
               $project: {
                    _id: 1,
                    title: 1,
                    latitude: 1,
                    longitude: 1,
                    picture: { $arrayElemAt: ['$pictures', 0] }, // pictures가 아니라 대표사진 하나이므로 picture이다
                    date: 1,
               },
          }
     ])

     for (let journalIdx in travelJournals) {
          let journal = travelJournals[+journalIdx]
          let nextJournal = travelJournals[+journalIdx + 1]
          if (!!nextJournal) {
               journal.stayTime = Math.floor((new Date(nextJournal.date).getTime() - new Date(journal.date).getTime()) / 1000)
          }
     }
     res.json({
          travelJournals,
     })
})

router.post('/:travelId/journals', async (req, res) => {
     // 로그인 만든 후 본인 여행인지 검사하는거넣기
     let { inputTab, input } = req.body
     let travels = new models.travelJournal({
          // user: ,
          travel: mongoose.Types.ObjectId(req.params.travelId),
          title: inputTab.title,
          date: new Date(input.date),
          pictures: input.pictures,
          latitude: input.myLatLng.lat,
          longitude: input.myLatLng.lng,
     })

     travels.save().then(() => {
          res.json({
               success: true,
          })
     }).catch(() => {
          res.json({
               success: false,
          })
     })


})

module.exports = router