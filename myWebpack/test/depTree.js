/**
 * Created by slipkinem on 12/25/2017 at 5:27 PM.
 */
const co = require('co')
const buildDeps = require('../lib/buildDeps')
const webpack = require('../lib/webpack')

// co(function *() {
//   const depTree = yield buildDeps('./main.js', {
//     context: ''
//   })
//   console.dir(depTree)
// })
co(function *() {
  const test = yield webpack('./main.js', {
    context: '',
    output: 'output.js'
  })
  console.log(test)
})