const express = require('express')
const mongoose = require('mongoose')
const models = require('../../models')

const router = express.Router()

// /travel/:travelId/journal

router.get('/:travelId/journals', async (req, res) => {
     let travelJournals = await models.travelJournal.find({

     })

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

     travels.save().then(()=>{
          res.json({
               success: true,
          })
     }).catch(()=>{
          res.json({
               success: false,
          })
     })

     
})

module.exports = router