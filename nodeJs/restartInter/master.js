/**
 * Created by slipkinem on 8/10/2017 at 6:24 PM.
 */
'use strict'
var fork = require('child_process').fork
var cpus = require('os').cpus()
var path = require('path')

var server = require('net').createServer()
server.listen(1337)

var workers = {}

/**
 * 创建子进程
 */
var createWorker = function () {
  var workUrl = path.join(__dirname, 'worker.js')
  var worker = fork(workUrl)
  // 接收子进程的消息，子进程process.send('message')
  worker.on('message', function (message) {
    console.log(message)
    if (message.act === 'suicide') {
      createWorker()
    }
  })

  // 监听子进程退出事件，退出一个进程则启动一个进程继续工作
  // 保持总有工作进程为主进程服务
  // kill pid 就会触发此函数
  worker.on('exit', function () {
    console.log('Worker ' + worker.pid + ' exited')
    delete workers[worker.pid]
  })

  // 句柄转发
  worker.send('server', server)
  workers[worker.pid] = worker
  console.log('Create worker.pid: ' + worker.pid)
}

for (var i = 0, ii = cpus.length; i < ii; i++) {
  createWorker()
}

// 进程自己退出时，让所有工作进程退出
process.on('exit', function () {
  for (var pid in workers) {
    workers[pid].kill()
  }
})
