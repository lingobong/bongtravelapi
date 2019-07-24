const path = require('path')

const { development } = require('../config')

module.exports = function ( ...args ) {
     let requirePath = path.resolve( ...args )
     if ( development ) {
          let startsWith = requirePath.replace(/\\/g,'\\\\')
          return function (req,res,next) {
               for ( let key of Object.keys(require.cache).filter(file => new RegExp('^'+startsWith).test(file)) ) {
                    delete require.cache[key]
               }
               return require(startsWith)(req,res,next)
          }
     }else{
          return require(requirePath)
     }
}