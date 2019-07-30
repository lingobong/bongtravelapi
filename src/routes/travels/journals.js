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

     let tourlistAttraction = new models.tourlistAttraction({
          name: inputTab.title,
          journal: journal._id,
          location: {
               type: 'Point',
               coordinates: [ // lng 먼저
                    input.myLatLng.lng,
                    input.myLatLng.lat,
               ],
          }
     })
     tourlistAttraction.save().then(() => { })

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


          models.tourlistAttraction.updateOne(
               {
                    journal: journal._id
               }, {
                    $set: {
                         name: inputTab.title,
                         location: {
                              type: 'Point',
                              coordinates: [ // lng 먼저
                                   input.myLatLng.lng,
                                   input.myLatLng.lat,
                              ],
                         }
                    },
               }, {
                    upsert: true
               }
          ).then(() => { })

     } else {
          fail()
     }
})

router.get('/journals/:journalId', async (req, res) => {
     let journal = await models.travelJournal.findOne({
          _id: mongoose.Types.ObjectId(req.params.journalId)
     })


     let TLAs = await models.tourlistAttraction.aggregate([
          // geoNear로 300m 내에 있는 관광지를 찾는다
          {
               $geoNear: {
                    spherical: true,
                    limit: 1000,
                    maxDistance: 300,
                    near: {
                         type: 'Point',
                         coordinates: [journal.longitude, journal.latitude],
                    },
                    distanceField: 'distance',
                    key: 'location',
               }
          },

          // 관광지 이름으로 group을 만들고, 가장가까운거리에있는 가장 가까운 거리를 찾는다
          // (관광지는 점이 아니라 범위이기때문에 데이터를 모아서 통계 결과를 활용하여 찾는다)
          {
               $group: {
                    _id: '$name',
                    distance: {
                         $min: '$distance'
                    },
                    count: {
                         $sum: 1
                    },
               }
          },
          // count에서 거리를 10으로 나눈 값을 빼서 스코어를 구한다
          {
               $project: {
                    _id: 0,
                    name: '$_id',
                    distance: '$distance',
                    score: {
                         $subtract: [
                              '$count',
                              {
                                   $divide: ['$distance', 10]
                              },
                         ]
                    }
               }
          },
          {
               $match: {
                    score: {
                         $gte: 0,
                    }
               }
          },
          {
               $sort: {
                    score: -1
               }
          },
          {
               $limit: 10,
          }
     ])
     // 거리가 30m 보다 좁은게 있다면 그 중 스코어가 가장 높은 것을 관광지로 보여줌
     let under30m = TLAs.filter(TLA => TLA.distance < 30).sort((a, b) => b.score - a.score)
     if (under30m.length > 0) {
          under30m[0].isRepr = true
          TLAs.length = Math.min(TLAs.length, 6)
     } else {
          TLAs.length = Math.min(TLAs.length, 5)
     }
     for (let TLA of TLAs) {
          TLA.score = Math.floor(TLA.score * 10) / 10
          TLA.distance = Math.floor(TLA.distance * 10) / 10
     }
     // 근처에 관광지명이 같은 데이터가 많아질수록, 그 관광지가 isRepr이 될 확률이 높아진다

     res.json({
          journal,
          tourlistAttractions: TLAs,
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

          models.tourlistAttraction.deleteOne({
               journal: journal._id
          }).then(() => { })

          res.json({
               success: true,
          })
     } else {
          res.json({
               success: false,
          })
     }


})

module.exports = router