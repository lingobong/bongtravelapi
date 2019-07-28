const express = require('express')
const mongoose = require('mongoose')
const models = require('../../models')

const router = express.Router()

router.use('/', require('./journals'))

router.get('/', async (req, res) => {
     let travels = await models.travel.find({
          // user:
     })

     res.json({
          travels,
     })
})
router.post('/', async (req, res) => {
     let travel = new models.travel({
          // user:
          title: req.body.title
     })

     travel.save().then(() => res.json({ success: true })).catch(() => res.json({ success: false }))
})

router.put('/:travelId', async (req, res) => {
     let { travelId } = req.params

     let success = () => res.json({ success: true })
     let fail = () => res.json({ success: false })
     
     let travel = await models.travel.findById(mongoose.Types.ObjectId(travelId))
     if(travel){
          travel.title = req.body.title
          travel.save().then(success).catch(fail)
     }else{
          fail()
     }
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