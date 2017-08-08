/**
 * Created by slipkinem on 8/2/2017 at 4:20 PM.
 */
'use strict'
var http = require('http')

var leakArray = []
var leak = function () {
  leakArray.push("leak " + Math.random())
}

http.createServer(function (req, res) {
  leak()
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  res.end('hello world\n')
}).listen(1337)

console.log('Server running at http://127.0.0.1:1337')