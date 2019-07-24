const express = require('express')
const mongoose = require('mongoose')
const models = require('../../models')

const router = express.Router()

router.use('/', require('./journals'))

router.get('/', async (req, res) => {
     let travels = await models.travel.find({

     })

     res.json({
          travels,
     })
})

router.delete('/:travelId', async (req, res) => {
     let { travelId } = req.params
     models.travel.deleteOne({ _id: travelId }).then(() => {
          res.json({
               success: true
          })
     }).catch(() => {
          res.json({
               success: false
          })
     })


})

module.exports = router