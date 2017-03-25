/**
 * Created by slipkinem on 2017/3/24.
 */
'use strict'

function Promise(resolver) {

  this.deferreds = []
  this.rejects = []
  var _this = this

  function resolve(value) {
    // 为了让.then先执行，防止非异步时resolve先执行，.then的回调没有注册进入deferred
    setTimeout(function () {
      _this.deferreds.forEach(function (deferred) {
        deferred(value)
      })
    }, 0)
  }

  function reject(value) {
    _this.rejects.forEach(function(reject) {
      reject(value)    
    })

  }

  resolver(resolve, reject)

}

Promise.prototype.then = function (onSuccess, onRejected) {
  this.deferreds.push(onSuccess)
  this.rejects.push(onRejected)
  return this
}


new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('haha')
    })
  })
  .then(function (result) {
    console.log(result)
  }, function(err) {
    console.log(err)
  })
  .then(function(value) {
    console.log(value)
  })