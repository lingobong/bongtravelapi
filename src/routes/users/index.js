const express = require('express')
const router = express.Router()
const models = require('../../models')
const { expressAuthorization } = require('../../services')

router.get('/', expressAuthorization.injectUser, async (req, res) => {
     res.json({
          success: req.isAuthenticated(),
          info: req.authInfo || {},
     })
})

module.exports = router