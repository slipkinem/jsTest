/**
 * Created by slipkinem on 8/10/2017 at 4:12 PM.
 */
'use strict'
process.on('message', function (m) {
  console.log('CHILD got message:', m)
})

process.send({foo: 'bar'})
console.log(process)
