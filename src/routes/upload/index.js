const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const md5 = require('md5')

router.post('/picture', (req, res) => {
     let D = new Date()
     let dirs = [
          D.getFullYear()+'',
          D.getFullYear()+'/'+(D.getMonth()+1),
          D.getFullYear()+'/'+(D.getMonth()+1)+'/'+D.getDate(),
          D.getFullYear()+'/'+(D.getMonth()+1)+'/'+D.getDate()+'/',
     ]
     for (let dir of dirs) {
          if (!fs.existsSync(`${__dirname}/../../static/${dir}`)) {
               fs.mkdirSync(`${__dirname}/../../static/${dir}`)
          }
     }
     let userFileDir = dirs[3]
     let filename = md5(Math.random()+'') + '.jpg'

     const storage = multer.diskStorage({
          destination: function (req, file, callback) {
               callback(null, `${__dirname}/../../static/${userFileDir}`) // callback 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
          },
          filename: function (req, file, callback) {
               callback(null, filename) // callback 콜백함수를 통해 전송된 파일 이름 설정
          },
     });
     const upload = multer({ storage: storage }).single('picture');

     upload( req, res, (err) => {
          if (err) {
               res.json({
                    success: false,
               })
          }else{
               res.json({
                    success: true,
                    path: userFileDir.replace(/^\/|\/$/,'')+'/'+filename
               })
          }
     } );
     
})


module.exports = router