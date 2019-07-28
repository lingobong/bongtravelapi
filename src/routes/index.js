const express = require('express')
const router = express.Router()

const { expressAutoReloader } = require('../services')

router.use('/upload', expressAutoReloader(__dirname, './upload'))
router.use('/users', expressAutoReloader(__dirname, './users'))
router.use('/travels', expressAutoReloader(__dirname, './travels'))
router.use('/socials', expressAutoReloader(__dirname, './socials'))
router.use('/login', expressAutoReloader(__dirname, './login'))


module.exports = router