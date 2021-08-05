/**
 * Created by sen.lv on 2021/6/4 at 17:06.
 */

// 注入编译的代码，启动一个socket进行连接

const io = require('socket.io-client/dist/socket.io')
const hotEmitter = require('./event')

const URL = '/'
const socket = io(URL)

let currentHash;

const onSocketMessage = {
  hash(hash) {
    console.log('hash', hash)
    currentHash = hash
  },
  ok() {
    console.log('ok')
    reloadApp()
  },
  connect() {
    console.log('client is connect')
  }
}

Object.keys(onSocketMessage).forEach(event => {
  socket.on(event, onSocketMessage[event])
})


function reloadApp () {
  console.log('reload, ', currentHash)
  const hot = true
  if (hot) {
    return hotEmitter.emit('webpackHotUpdate', currentHash)
  }
  window.location.reload()
}
