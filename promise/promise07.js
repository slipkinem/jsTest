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
}

/**
 * Promise类
 * @constructor
 */
class Promise extends util {
  /**
   * 构造器
   * @param executor
   */
  constructor(executor) {
    /**
     * executor必须是一个函数
     */
    if (!Promise.isFunction(executor)) throw new TypeError('参数必须是一个函数')

    /**
     * 绑定继承的util的this
     */
    super(executor)
    /**
     * .then注册存储正确回调
     * @type {Array}
     * @private
     */
    this._deferreds = []
    /**
     * 错误数据回调
     * @type {Array}
     * @private
     */
    this._rejecteds = []
    /**
     * 状态 挂起
     * 可以过渡到 RESOLVED和REJECTED
     * @type {string}
     */
    this.PENDING = 'PENDING'
    /**
     * 成功
     * 最终值，不可以改变
     * @type {string}
     */
    this.RESOLVED = 'RESOLVED'
    /**
     * 失败状态
     * 最终值
     * @type {string}
     */
    this.REJECTED = 'REJECTED'
    /**
     * 当前的状态
     * @type {*}
     * @private
     */
    this._status = this.PENDING
    /**
     * 存储的异步返回值数据，在then方法的resolve执行后回调函数的参数值
     * @type {Object}
     * @private
     */
    this._data = Object.create(null)
    const _this = this

    /**
     * 成功函数
     * @param {any} value
     */
    function resolve(value) {
      /**
       * 异步执行，为了使then方法先执行
       * 在此函数里面改变status,将使用.then的时候直接拿到this._data的数据
       */
      setTimeout(() => {
        if (_this._status === _this.PENDING) {
          _this._status = _this.RESOLVED
          _this._data = value

          _this._deferreds.forEach(function (deferred) {
            deferred(value)
          })

        }
      })
    }

    /**
     * 失败函数
     * @description 将状态码置为失败，执行.then里面注册的失败函数
     * @param {any} reason
     */
    function reject(reason) {
      setTimeout(() => {
        if (_this._status === _this.PENDING) {
          _this._status = _this.REJECTED
          _this._data = reason

          _this._rejecteds.forEach((reject) => {
            reject(reason)
          })

        }
      })
    }

    try {
      /**
       * 将resolve函数和reject函数当做executor的参数传递过去
       */
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }

  }

  /**
   * @name then
   * @description 注册回调, 参数一：成功回调，参数二，错误回调
   * @param {function} onFulfilled
   * @param {function} onRejected
   * @returns {Promise} promise
   */
  then(onFulfilled, onRejected) {
    /**
     * 如果onFulfilled不是函数，则转换为函数，return value是为了将参数值传递过去
     * @example
     * promise
     *    .then()
     *    .then(function(result){ result })
     * @type {Function}
     */
    onFulfilled = Promise.isFunction(onFulfilled) ? onFulfilled : function (value) {
        return value
      }

    onRejected = Promise.isFunction(onRejected) ? onRejected : function (reason) {
        return reason
      }
    /**
     * 每次都会return一个promise
     * 如果promise状态是RESOLVED则拿取存储的this.data
     */
    if (this._status === this.RESOLVED) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            let returnedValue = onFulfilled(this._data)

            if (returnedValue instanceof Promise) {
              returnedValue.then(resolve, reject)
            }

            resolve(returnedValue)
          } catch (e) {
            reject(e)
          }

        })

      })
    }

    if (this._status === this.REJECTED) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {

            let returnedValue = onRejected(this._data)

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
    /**
     * 如果promise的状态是PENDING，则无法确定其执行的成功或者失败
     * 所以将每个需要执行的函数放入数组里面，在外层promise 的 resolve执行的时候调用函数
     * 继续return一个promise
     */
    if (this._status === this.PENDING) {
      return new Promise((resolve, reject) => {
        this._deferreds.push((value) => {
          try {
            let returnedValue = onFulfilled(value)

            if (returnedValue instanceof Promise) {
              returnedValue.then(resolve, reject)
            }
            resolve(returnedValue)
          } catch (e) {
            reject(e)
          }
        })

        this._rejecteds.push((reason) => {
          try {
            let returnedValue = onFulfilled(reason)

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

  /**
   * @description 方便使用，封装一个catch函数，用于捕获错误
   * @param onRejected
   * @returns {Promise}
   */
  catch(onRejected) {
    return this.then(null, onRejected)
  }

  /**
   * @name all
   * @description 为了使多个异步方法统一处理，结果是一个数组，只要一个异步失败，则reject
   * @param {array} promises
   * @returns {Promise} promise
   */
  static all(promises) {
    if (!Array.isArray(promises)) {
      throw new TypeError('promises 必须是一个数组')
    }

    /**
     * all 返回一个promise
     */
    return new Promise((resolve, reject) => {
      /**
       * result存储结果
       * @type {Array}
       */
      let result = [],
        /**
         * 数组的长度，用于判断是否全部结束
         */
        len = promises.length

      /**
       * 当所有的promise执行完成后将result resolve出去
       * @param value
       */
      function resolveAll(value) {
        result.push(value)

        if (--len === 0) {
          resolve(result)
        }
      }

      promises.forEach((promise) => {
        promise.then(resolveAll, (err) => {
          reject(err)
        })
      })

    })


  }

}

var promises = []
for (let i = 0; i < 7; i++) {
  promises.push(
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('haha')
      })
    })
  )
}

promises.push(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('err')
    })
  })
)

Promise.all(promises)
  .then((result) => {
    console.log(result)
  })
  .catch(function (err) {
    console.log(err)
  })