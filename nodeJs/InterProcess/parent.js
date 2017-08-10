/**
 * Created by slipkinem on 8/10/2017 at 3:08 PM.
 */
'use strict'
// 连接的子进程是node进程，子进程会根据环境变量去连接IPC通道，
// 如果不是node进行需要匹配约定
var cp = require('child_process')
var n = cp.fork(__dirname + '/sub.js')

n.on('message', function (m) {
  console.log('PARENT got message: ', m)
})

n.send({hello: 'word'})
