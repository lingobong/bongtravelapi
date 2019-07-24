const express = require('express')
const mongoose = require('mongoose')
const app = express()
const config = require('./config')

mongoose.connect(config.db.mongodb, { useNewUrlParser: true })

// 초기화
require('./models')
require('./services')

// 라우트
app.use('/static', express.static(__dirname+'/static'))

app.use(express.json())

app.use(require('./routes'))


app.listen(9720)