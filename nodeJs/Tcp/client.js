/**
 * Created by slipkinem on 8/3/2017 at 11:27 AM.
 */
'use strict'
const log = console.log.bind(console)
var net = require('net')

/**
 * 连接TCP，客户端
 */
var client = net.connect({
  port: 5999
}, function () {
  log('client connected')
  client.write('fdjskf')
})

client.on('data', function (data) {
  log(data.toString())
  client.end()
})

client.on('end', function () {
  log('client disconnected')
})
