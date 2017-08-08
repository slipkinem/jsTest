/**
 * tcp: 传输控制协议
 * OSI模型七层（自上而下）： 应用层（HTTP）、表示层（加密解密）、会话层（通信连接/维持会话）、传输层（TCP/UDP）、网络层（IP）、链路层（接口）、物理层（硬件）
 *
 * Created by slipkinem on 8/2/2017 at 6:21 PM.
 */
'use strict'
const log = console.log.bind(console)
const net = require('net')

/**
 * 建立TCP连接，服务端
 */
var server = net.createServer(function (socket) {
  socket.on('data', function (data) {
    socket.write('hello')
  })

  socket.on('end', function () {
    console.log('网络断开')
  })

  socket.write('welcome')

})

server.listen(5999, function () {
  console.log('server bound')
})

