/**
 * Created by slipkinem on 2017/3/27.
 */
'use strict'
/**
 * 工具类
 */
class util {
  static isFunction(value) {
    return typeof value === 'function'
  }

  static isArray(value) {
    return Array.isArray(value)
  }
}

/**
 * Promise
 * @constructor
 */
class Promise extends util {
  constructor(executor) {
    super(executor)

    if (!Promise.isFunction(executor)) throw new TypeError('参数必须是一个函数')
    this._status = 'PENDING'
    this._value = Object.create(null)
    this._reason = Object.create(null)
    this._rejecteds = []
    this._deferreds = []
    let _this = this

    function resolve(value) {
      setTimeout(() => {
        try {
          if (_this._status === 'PENDING') {
            _this._status = 'RESOLVED'
            _this._value = value

            _this._deferreds.forEach((deferred) => {
              deferred(value)
            })

          }
        } catch (e) {
          reject(e)
        }

      })
    }

    function reject(reason) {
      setTimeout(() => {
        try {
          if (_this._status === 'PENDING') {
            _this._status = 'REJECTED'
            _this._reason = reason

            _this._rejecteds.forEach((rejected) => {
              rejected(reason)
            })
          }
        } catch (e) {
          reject(e)
        }
      })
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }

  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static all(promises) {
    if (!Promise.isArray(promises)) throw new TypeError('promises 必须是一个数组')

    return new Promise((resolve, reject) => {
      let result = [],
        len = promises.length

      function resolveAll(value) {
        result.push(value)

        if (--len === 0) {
          resolve(result)
        }
      }

      promises.forEach(function (promise) {
        /**
         * 将成功后的加入result数组
         * 一旦有一个失败，则直接返回失败
         */
        promise.then(resolveAll, reject)
      })

    })
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }

  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      let returnedValue = Object.create(null)
      /**
       * 如果是RESOLVED状态说明执行了过resolve函数，this.value是有值的
       * e.g. Promise.resolve('resolve').then(function(result){})
       * 最主要看onFulfilled返回值是什么
       */
      /**
       * _RESOLVED
       * @param value
       * @private
       */
      function _RESOLVED(value) {
        returnedValue = Promise.isFunction(onFulfilled) && onFulfilled(value) || value

        try {
          if (returnedValue && returnedValue instanceof Promise) {
            returnedValue.then((value) => {
              resolve(value)
            }, (reason) => {
              reject(reason)
            })
          } else {
            resolve(returnedValue)
          }

        } catch (e) {
          reject(e)
        }
      }

      /**
       * 失败的错误
       * @param reason
       * @private
       */
      function _REJECTED(reason) {
        returnedValue = Promise.isFunction(onRejected) && onRejected(reason) || reason

        reject(returnedValue)
      }


      if (this._status === 'RESOLVED') {
        _RESOLVED(this._value)

      } else if (this._status === 'REJECTED') {
        _REJECTED(this._reason)

      } else if (this._status === 'PENDING') {
        /**
         * e.g. new Promise().then(function(result){})
         */
        this._deferreds.push(_RESOLVED)

        this._rejecteds.push(_REJECTED)
      }

    })

  }

}

module.exports = Promise