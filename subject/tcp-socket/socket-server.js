/**
 * Created by sen.lv on 2021/6/24 at 15:22.
 */
const net = require('net')

var host = '127.0.0.1'
var port = 5643

net.createServer(function(socket) {

  socket.on('data', (res) => {
    const data = JSON.parse(res)
    if (data.code === 1) {
      console.log(data.text)
      socket.write(JSON.stringify({code: 0, text: '关闭'}))
      setTimeout(() => {
        socket.write(JSON.stringify({code: 0, text: '飞机的数量开发进度是昆仑剑法迪斯科解放反倒是房间里的思考'}))
      }, 5000)
    }
  })

  socket.on('close', (res) => {
    console.log(res)
    console.log('server is close-----')
  })

}).listen(port, host)
