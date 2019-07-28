const models = require('../models')

const injectUser = async (req, res, next) => {
     let token = req.headers['authorization']
     let userToken = await models.userToken.findOne({
          token,
     })
     let user = await models.user.findById(userToken.user)

     req.authInfo = user
     req.isAuthenticated = () => !!user
     req.isUnauthenticated = () => !user

     next()
}
const authRequired = async (req, res, next) => {
     injectUser(req, res, () => {
          if (req.isAuthenticated()) {
               next()
          } else {
               res.json({
                    authRequired: true
               })
          }
     })
}

module.exports = {
     injectUser,
     authRequired,
}