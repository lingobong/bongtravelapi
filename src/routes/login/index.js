const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const models = require('../../models')
const crypto = require('crypto')

router.post('/naver', (req, res) => {

     fetch('https://openapi.naver.com/v1/nid/me', {
          headers: {
               'Authorization': `Bearer ${req.body.token}`
          }
     }).then(rs => rs.json()).then(async (rs) => {
          let { id } = rs.response
          let snsId = `naver/${id}`
          let loginToken = crypto.randomBytes(64).toString('hex') // 새로운 로그인토큰

          let user = await models.user.findOne({ snsId })
          if ( !user ) {
               user = new models.user({
                    snsId,
                    nickname: `n${id}`,
               })
               await user.save()

               // 가입하면 여행 탭 하나를 만들어준다
               let travel = new models.travel({
                    user: user._id,
                    title: '나의 여행'
               })
          
               await travel.save()
          }

          // 동시로그인 방지(기존 토큰을 초기화해준다)
          await models.userToken.deleteMany({ user: user._id })

          let userToken = new models.userToken({
               user: user._id,
               token: loginToken,
          })
          await userToken.save()
          

          res.json({
               success: !!id,
               loginToken,
          })
     })
})


module.exports = router