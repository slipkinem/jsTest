/**
 * Created by slipkinem on 2017/3/24.
 */
'use strict'

function isFunction(value) {
  return typeof value === 'function'
}

/**
 * Promise构造器
 * @param {function} resolver
 * @constructor
 */
function Promise(resolver) {

  if (!isFunction(resolver)) throw new TypeError('参数必须是一个函数')

  var _this = this
  this._deferreds = []
  this._rejecteds = []
  this.PENDING = 'PENDING'
  this.RESOLVED = 'RESOLVED'
  this.REJECTED = 'REJECTED'
  this._status = this.PENDING
  this._data = Object.create(null)

  function resolve(value) {
    setTimeout(function () {
      if (_this._status === _this.PENDING) {
        _this._status = _this.RESOLVED
        _this._data = value

        _this._deferreds.forEach(function (deferred) {
          deferred(value)
        })

      }

    }, 0)
  }

  function reject(reason) {
    setTimeout(function () {
      if (_this._status === _this.PENDING) {
        _this._status = _this.REJECTED
        _this._data = reason

        _this._rejecteds.forEach(function (reject) {
          reject(reason)
        })

      }

    }, 0)

  }


  try {
    resolver(resolve, reject)
  } catch (e) {
    reject(e)
  }

}

Promise.prototype.then = function (onFulfilled, onRejected) {
  var _this = this

  onFulfilled = isFunction(onFulfilled) ? onFulfilled : function (value) {
      return value
    }

  onRejected = isFunction(onRejected) ? onRejected : function (reason) {
      throw reason
    }

  if (this._status === this.RESOLVED) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var returnedValue = onFulfilled(_this._data)

          if (returnedValue instanceof Promise) {
            returnedValue.then(resolve, reject)
          }

          resolve(returnedValue)
        } catch (e) {
          reject(e)
        }
      }, 0)

    })
  }

  if (this._status === this.REJECTED) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var returnedValue = onRejected(_this._data)

          if (returnedValue instanceof Promise) {
            returnedValue.then(resolve, reject)
          }
        } catch (e) {
          reject(e)
        }
      }, 0)
    })
  }

  if (this._status === this.PENDING) {
    return new Promise(function (resolve, reject) {

      _this._deferreds.push(function (value) {
        try {
          var returnedValue = onFulfilled(value)

          if (returnedValue instanceof Promise) {
            returnedValue.then(resolve, reject)
          }
          resolve(returnedValue)
        } catch (e) {
          reject(e)
        }

      })

      _this._rejecteds.push(function (reason) {
        try {
          var returnedValue = onRejected(reason)

          if (returnedValue instanceof Promise) {
            returnedValue.then(resolve, reject)
          }
          reject(returnedValue)
        } catch (e) {
          reject(e)
        }

      })

    })
  }

}

Promise.resolve = function () {

}

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('hahah')
    // reject('err')
  })
})
  .then(function (result) {
    console.log(result)
    // return result
  })
  .then(function (result) {
    console.log(result)
  })
  .catch(function (err) {
    console.log(err)
  })
  .catch(function (err) {
    console.log(err)
  })
