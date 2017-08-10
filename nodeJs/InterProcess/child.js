/**
 * Created by slipkinem on 8/10/2017 at 4:48 PM.
 */
'use strict'
process.on('message', function (m, server) {
  if (m === 'server') {
    server.on('connection', function (socket) {
      socket.end('handled by child\n')
    })
  }
})