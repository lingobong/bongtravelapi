const express = require('express')
const router = express.Router()

router.use('/user', require('./user'))
router.use('/social', require('./social'))


module.exports = router