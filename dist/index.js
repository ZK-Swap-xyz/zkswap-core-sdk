
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./ks-sdk-core.cjs.production.min.js')
} else {
  module.exports = require('./ks-sdk-core.cjs.development.js')
}
