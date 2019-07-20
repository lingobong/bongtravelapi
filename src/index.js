const express = require('express')
const app = express()

// 초기화
require('./models')

// 초기화
require('./services')

app.use(express.json())
app.use('/static', express.static('static'))
app.use(require('./routes'))


app.listen(9720)