const models = require('../models')

module.exports = {
     async injectUser(req, res, next) {
          let token = req.headers['authorization']
          let user = await models.userToken.findOne({
               token,
          })

          req.authInfo = user
          req.isAuthenticated = () => !!user
          req.isUnauthenticated = () => !user

          next()
     },
     async authRequired(req, res, next) {
          this.injectUser(req, res, () => {
               if (req.isAuthenticated()) {
                    next()
               } else {
                    res.json({
                         authRequired: true
                    })
               }
          })
     },
}