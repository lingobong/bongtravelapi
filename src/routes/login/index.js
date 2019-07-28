const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

router.post('/naver', (req, res) => {

     fetch('https://openapi.naver.com/v1/nid/me', {
          headers: {
               'Authorization': "Bearer " + req.body.token
          }
     }).then(rs => rs.json()).then(rs => {
          let { id } = rs.response
          let loginToken = ''

          res.json({
               success: !!id,
               loginToken,
          })
     })
})


module.exports = router