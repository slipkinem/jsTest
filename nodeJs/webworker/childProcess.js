/**
 * Created by slipkinem on 8/10/2017 at 2:23 PM.
 */
'use strict'
var cp = require('child_process')

cp.spawn('node', ['webworker.js'])

cp.exec('node webworker.js', function (err, stdout, stderr) {
  console.log(err, stdout, stderr)
})

// cp.execFile('webworker.js', function (err, stdout, stderr) {
//   console.log(err, stdout, stderr)
// })

cp.fork('./webworker.js')

// cp.exec('ping baidu.com', function (err, stdout, stderr) {
//   console.log(err, stdout, stderr)
// })
