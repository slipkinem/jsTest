/**
 * Created by slipkinem on 2017/2/21.
 */
'use strict'

function Promise(resolver) {
  var queue = []

  resolver(resolve, reject)

  function next(state, val) {
    var arr, chainRs
    setTimeout(function () {
      if (arr === queue.shift()) {
        chainRs = arr[state](val)
        if (!chainRs) return
        if (chainRs && typeof chainRs.then == 'function') {
          chainRs.then(resolve, reject)
        } else {
          resolve(chainRs)
        }
      }
    }, 0)
  }

  function resolve(x) {
    next(0, x)
  }

  function reject(reason) {
    next(1, reason)
  }

  this.then = function (resolve, reject) {
    queue.push([resolve, reject])
    return this
  }

}

Promise.resolve = Promise.cast = function (x) {
  return new Promise(function (resolve) {
    resolve(x)
  })
}

var p = new Promise(function (resolve) {
  setTimeout(function () {
    resolve('ok')
  }, 1000)
})
.then(function (data) {
  console.log(data)
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve('sdfsfad')
    }, 2000)
  })
})
.then(function (data) {
  console.log('2', data)
})
.then(function (data) {
  console.log('3', data)
})