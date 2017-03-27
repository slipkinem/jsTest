/**
 * Created by slipkinem on 2017/3/27.
 */
'use strict'

function isFunction(value) {
  return typeof value === 'function'
}

function Promise(executor) {

  if (!isFunction(executor)) throw new TypeError('参数必须是一个函数')

  var _this = this
  this._status = 'PENDING'
  this._value = Object.create(null)
  this._reason = Object.create(null)
  this._rejecteds = []
  this._deferreds = []

  function resolve(value) {
    setTimeout(function () {
      if (_this._status === 'PENDING') {
        _this._status = 'RESOLVED'
        _this._value = value

        _this._deferreds.forEach(function (deferred) {
          deferred(value)
        })

      }
    })
  }

  function reject(reason) {
    setTimeout(function () {
      if (_this._status === 'PENDING') {
        _this._status = 'REJECTED'
        _this._reason = reason

        _this._rejecteds.forEach(function (_rejected) {
          _rejected(reason)
        })
      }
    })
  }

  executor(resolve, reject)

}

Promise.prototype.then = function (onFulfilled, onRejected) {
  var _this = this,
    returnedValue

  return new Promise(function (resolve, reject) {
    /**
     * 如果是RESOLVED状态说明执行了过resolve函数，this.value是有值的
     * e.g. Promise.resolve('resolve').then(function(result){})
     * 最主要看onFulfilled返回值是什么
     */
    if (_this._status === 'RESOLVED') {
      returnedValue = onFulfilled && onFulfilled(_this._value) || _this._value
      resolve(returnedValue)

    } else if (_this._status === 'REJECTED') {
      returnedValue = onRejected(_this._reason)
      reject(returnedValue)

    } else if (_this._status === 'PENDING') {
      /**
       * e.g. new Promise().then(function(result){})
       */
      _this._deferreds.push(function (value) {
        returnedValue = isFunction(onFulfilled) && onFulfilled(value) || value

        // console.log(returnedValue)
        resolve(returnedValue)
      })

      _this._rejecteds.push(function (reason) {
        returnedValue = isFunction(onRejected) && onRejected(reason) || reason
        reject(returnedValue)
      })
    }

  })

}

new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('haha')
  })
})
  .then('tests')
  .then(function (result) {
    console.log(result)
  })
