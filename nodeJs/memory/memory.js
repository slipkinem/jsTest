/**
 * Created by slipkinem on 8/2/2017 at 3:52 PM.
 */
'use strict'

function showMemory () {
  var mem = process.memoryUsage()

  function fermat (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + 'MB'
  }

  console.log(
    'Process: heapTotal '
    + fermat(mem.heapTotal) + ' heapUsed '
    + fermat(mem.heapUsed) + ' rss ' + fermat(mem.rss)
  )

}

function useMemory () {
  var size = 20 * 1024 * 1024,
    arr = new Buffer(size)

  for (var i = 0; i < size; i++) {
    arr[i] = 0
  }
  return arr
}

var total = []

for (var i = 0; i < 1500; i++) {
  showMemory()
  total.push(useMemory())
}

showMemory()