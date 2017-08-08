/**
 * Created by slipkinem on 8/3/2017 at 11:21 AM.
 */
'use strict'
const log = console.log.bind(console)
const dgram = require('dgram')

const server = dgram.createSocket('udp4')

server.on('message', function (msg, rinfo) {
  log(`server got: ${msg} from ${rinfo.address} : ${rinfo.port}`)
})

server.on('listening', function () {
  var address = server.address()
  log(`server listening ${address.address} : ${address.port}`)
})

server.bind(41234)
