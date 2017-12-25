/**
 * 工作进程，为主进程master服务，当有异常未捕获的时候，关闭接收新连接
 * 当所有连接断开后，退出进程
 * pid是一个进程暂时的身份证号，不会一直不改变，当进程重启时会改变
 * Created by slipkinem on 8/10/2017 at 2:14 PM.
 */
'use strict'
var http = require('http')

/**
 * 新建一个http服务
 */
var server = http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  res.end('handled by child, pid is ' + process.pid + '\n')
  throw new Error('throw exception')
})

var worker = null
/**
 * 监听主进程发送的数据， 创建的子进程的work.send('message')
 */
process.on('message', function (m, tcp) {
  if (m === 'server') {
    // 将主进程创建的tcp服务赋值给worker
    worker = tcp
  }
  worker.on('connection', function (socket) {
    server.emit('connection', socket)
  })
})

/**
 * 捕获异常事件
 * process用于向主进程接收或者发送数据
 * 主进程worker.send 子进程process.on接收
 */
process.on('uncaughtException', function (err) {
  console.log('uncaughtException', err)
  process.send({act: 'suicide'})

  // 停止接收新的连接
  worker.close(function () {
    console.log('worker.close')
    // 所有连接断开后退出进程
    process.exit(1)
  })

  // 防止长连接断开时间过长，5秒后强制退出
  setTimeout(function () {
    process.exit(1)
  }, 5000)

})
