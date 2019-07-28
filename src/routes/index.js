const express = require('express')
const router = express.Router()

const { expressAutoReloader, expressAuthorization } = require('../services')

router.use('/upload', expressAuthorization.authRequired, expressAutoReloader(__dirname, './upload'))
router.use('/users', expressAutoReloader(__dirname, './users'))
router.use('/travels', expressAuthorization.authRequired, expressAutoReloader(__dirname, './travels'))
router.use('/socials', expressAuthorization.authRequired, expressAutoReloader(__dirname, './socials'))
router.use('/login', expressAutoReloader(__dirname, './login'))


module.exports = router