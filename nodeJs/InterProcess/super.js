/**
 * Created by slipkinem on 8/10/2017 at 4:49 PM.
 */
'use strict'
var child = require('child_process').fork('child.js')

// 打开一个服务对象然后发送需要处理的
var server = require('net').createServer()
server.on('connection', function (socket) {
  socket.end('handled by parent\n')
})

server.listen(1337, function () {
  child.send('server', server)
})
