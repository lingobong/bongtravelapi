const express = require('express')
const mongoose = require('mongoose')
const models = require('../../models')

const router = express.Router()
const { journalSearch } = require('../../services')

// /travel/:travelId/journal

router.get('/:travelId/journals', async (req, res) => {
     let travel = await models.travel.findById(mongoose.Types.ObjectId(req.params.travelId))
     if (travel.user + '' != req.authInfo._id + '') {
          return res.json({ success: false })
     }

     let travelJournals = await models.travelJournal.aggregate([
          {
               $match: {
                    user: req.authInfo._id, //인덱스 사용을 위해 추가
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
               $addFields: {
                    picture: { $arrayElemAt: ['$pictures', 0] },
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
     let success = () => {
          journalSearch.journalWrite(journal)
          res.json({
               success: true,
          })
     }
     let fail = () => {
          res.json({
               success: false,
          })
     }
     let travel = await models.travel.findById(mongoose.Types.ObjectId(req.params.travelId))
     if (travel.user + '' != req.authInfo._id + '') {
          return fail()
     }

     let { inputTab, input } = req.body
     let journal = new models.travelJournal({
          user: req.authInfo._id,
          travel: mongoose.Types.ObjectId(req.params.travelId),
          title: inputTab.title,
          date: new Date(input.date),
          pictures: input.pictures,
          latitude: input.myLatLng.lat,
          longitude: input.myLatLng.lng,
          description: input.description,
     })

     journal.save().then(success).catch(fail)

})

router.put('/journals/:journalId', async (req, res) => {
     let success = () => {
          journalSearch.journalEdit(journal)
          res.json({
               success: true,
          })
     }
     let fail = () => {
          res.json({
               success: false,
          })
     }

     let { inputTab, input } = req.body
     let journal = await models.travelJournal.findOne({
          _id: mongoose.Types.ObjectId(req.params.journalId),
          user: req.authInfo._id,
     })
     if (!!journal) {
          journal.title = inputTab.title
          journal.date = new Date(input.date)
          journal.pictures = input.pictures
          journal.latitude = input.myLatLng.lat
          journal.longitude = input.myLatLng.lng
          journal.description = input.description

          journal.save().then(success)
     } else {
          fail()
     }
})

router.get('/journals/:journalId', async (req, res) => {
     let journal = await models.travelJournal.findOne({
          _id: mongoose.Types.ObjectId(req.params.journalId)
     })

     res.json({
          journal
     })
})

router.delete('/journals/:journalId', async (req, res) => {
     let journal = await models.travelJournal.findOne({
          _id: mongoose.Types.ObjectId(req.params.journalId)
     })

     if (journal.user + '' == req.authInfo._id + '') {
          journalSearch.journalDelete(journal)

          await models.travelJournal.deleteOne({
               _id: journal._id
          })

          res.json({
               success: true,
          })
     } else {
          res.json({
               success: false,
          })
     }


})

router.get('/journals/:journalId', async (req, res) => {
     let journal = await models.travelJournal.findOne({
          _id: mongoose.Types.ObjectId(req.params.journalId)
     })

     res.json({
          journal
     })
})

module.exports = router