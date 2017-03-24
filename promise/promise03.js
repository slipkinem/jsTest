/**
 * Created by slipkinem on 2017/3/24.
 */
'use strict'

function isFunction(value) {
  return typeof value === 'function'
}

function Promise(resolver) {

  var promise = this

  if (!isFunction(resolver)) {
    throw new TypeError('不是函数')
  }

  if (!(this instanceof Promise)) return new Promise(resolver)

  promise.deferreds = []

  var resolve = function (value) {
    promise.deferreds.forEach(function (deferred) {
      deferred(value)
    })
  }

  resolver(resolve)

}

Promise.prototype.then = function (onFulfilled, onRejected) {
  // return new Promise(function (resolve, reject) {
  //   onFulfilled()
  // })
  this.deferreds.push(onFulfilled)
}

var resolver = function (resolve) {  // 将resolver传入参数并执行
  setTimeout(function () {
    resolve('haha')
  }, 0)
}

var promise = new Promise(resolver)

promise.then(function (result) {
  console.log(result)
})