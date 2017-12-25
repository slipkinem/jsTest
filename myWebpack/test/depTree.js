/**
 * Created by slipkinem on 12/25/2017 at 5:27 PM.
 */
const co = require('co')
const buildDeps = require('../lib/buildDeps')

co(function *() {
  const depTree = yield buildDeps('./main.js', {
    context: ''
  })
  console.dir(depTree)
})
