/**
 * Created by sen.lv on 2021/6/24 at 17:16.
 */
const net = require('net')

var host = '127.0.0.1'
var port = 5643

var socket = new net.Socket()

socket.connect(port, host, () => {
  setTimeout(() => {
    socket.write(JSON.stringify({code: 1, text: '你好啊，傻逼2222222'}))
  }, 3000)
})

socket.on('data', data => {
  const res = JSON.parse(data)
  if (res.code === 0) {
    console.log(res.text)
    // socket.destroy()
  }
})


socket.on('close', res => {
  console.log(res)
  console.log('close-------')
})
