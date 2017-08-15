/**
 * Created by slipkinem on 8/11/2017 at 2:07 PM.
 */
'use strict'
var fork = require('child_process').fork
var path = require('path')

var limit = 10
var during = 60000
var restart = []

/**
 * 是否过于频繁
 * @returns {boolean}
 */
var isTooFrequently = function () {
  var time = Date.now()
  // 获取restart放入time的长度
  var length = restart.push(time)
  // 判断长度是否超过10
  if (length > limit) {
    // 取出前10个数据
    restart = restart.slice(limit * -1)
  }
  // 最后一次重启和第一次重启的时间间隔，大于60000不算频繁重启？也有点道理吧
  return restart.length >= limit && restart[restart.length - 1] - restart[0] < during

}

var workers = {}

var createWorker = function () {
  // 检查是否太过频繁
  if (isTooFrequently()) {
    return process.emit('giveup', length, during)
  }

  var worker = fork(path.join(__dirname, 'worker.js'))

  // 监听进程退出
  worker.on('exit', function () {
    console.log('Worker ' + worker.pid + ' exited.')
    delete workers[worker.pid]
  })

  // 监听子进程发过来的消息
  worker.on('message', function (message) {
    if (message.cat === 'suicide') {
      createWorker()
    }
  })

  worker.send('server', server)
  worker[worker.pid] = worker
  console.log('Create worker.pid: ' + worker.pid)
}
