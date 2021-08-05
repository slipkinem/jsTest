/**
 * Created by sen.lv on 2021/6/25 at 17:05.
 */
const socket = require('dgram')

const client = socket.createSocket('udp4')

client.send('hello', 4344)
