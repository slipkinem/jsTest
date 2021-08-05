/**
 * Created by sen.lv on 2021/6/25 at 15:33.
 */
const dgram = require('dgram')

const socket = dgram.createSocket('udp4')

socket.on('message', (msg, info) => {
  console.log(msg.toString('utf8'), '-----', info)
})

socket.on('listening', () => {
  const address = socket.address()
  console.log('listening ', address)
})

socket.bind(4344)
