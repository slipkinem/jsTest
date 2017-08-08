/**
 * Created by slipkinem on 8/3/2017 at 11:25 AM.
 */
'use strict'
const dgram = require('dgram')

var message = new Buffer('hehehehe')

var client = dgram.createSocket('udp4')

client.send(message, 0, message.length, 41234, 'localhost', function (err, bytes) {
  client.close()
})
