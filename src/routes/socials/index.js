const express = require('express')
const router = express.Router()
const models = require('../../models')
const mongoose = require('mongoose')

router.get('/latest', async (req, res) => {
     let { lastId } = req.query
     let aggregate = []
     if (!!lastId) {
          aggregate.push({
               $match: {
                    _id: {
                         $lt: mongoose.Types.ObjectId(lastId)
                    }
               }
          })
     }
     aggregate.push({
          $sort: {
               _id: -1,
          }
     })
     aggregate.push({
          $limit: 20,
     })
     aggregate.push({
          $addFields: {
               picture: {
                    $arrayElemAt: ['$pictures', 0]
               },
               pictures: null,
          }
     })
     let journals = await models.travelJournal.aggregate(aggregate)
     res.json({
          journals
     })
})

module.exports = router