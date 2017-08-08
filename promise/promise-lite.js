/**
 * Created by slipkinem on 2017/3/27.
 */
'use strict'

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback/*, thisArg*/) {

    var T, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat while k < len.
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator.
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c.
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined.
  };
}

function isFunction (value) {
  return typeof value === 'function'
}

function Promise (executor) {

  if (!isFunction(executor)) throw new TypeError('参数必须是一个函数')

  var _this = this
  this._status = 'PENDING'
  this._value = null
  this._reason = null
  this._rejecteds = []
  this._deferreds = []

  function resolve (value) {
    setTimeout(function () {
      try {
        if (_this._status === 'PENDING') {
          _this._status = 'RESOLVED'
          _this._value = value

          _this._deferreds.forEach(function (deferred) {
            deferred(value)
          })

        }
      } catch (e) {
        reject(e)
      }

    })
  }

  function reject (reason) {
    setTimeout(function () {
      try {
        if (_this._status === 'PENDING') {
          _this._status = 'REJECTED'
          _this._reason = reason

          _this._rejecteds.forEach(function (rejected) {
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

Promise.resolve = function (value) {
  return new Promise(function (resolve, reject) {
    resolve(value)
  })
}

Promise.all = function (promises) {
  if (!Array.isArray(promises)) throw new TypeError('promises 必须是一个数组')

  return new Promise(function (resolve, reject) {
    var result = [],
      len = promises.length

    function resolveAll (value) {
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

Promise.prototype.fail = function (onRejected) {
  this.then(null, onRejected)
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
    /**
     * _RESOLVED
     * @param value
     * @private
     */
    function _RESOLVED (value) {
      returnedValue = isFunction(onFulfilled) && onFulfilled(value) || value

      try {
        if (returnedValue && returnedValue instanceof Promise) {
          returnedValue.then(function (value) {
            resolve(value)
          }, function (reason) {
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
    function _REJECTED (reason) {
      returnedValue = isFunction(onRejected) && onRejected(reason) || reason

      reject(returnedValue)
    }


    if (_this._status === 'RESOLVED') {
      _RESOLVED(_this._value)

    } else if (_this._status === 'REJECTED') {
      _REJECTED(_this._reason)

    } else if (_this._status === 'PENDING') {
      /**
       * e.g. new Promise().then(function(result){})
       */
      _this._deferreds.push(_RESOLVED)

      _this._rejecteds.push(_REJECTED)
    }

  })

}
window.Promise = Promise
// new Promise(function (resolve, reject) {
//   setTimeout(function () {
//     resolve('haha')
//   })
// })
//   .then(function (result) {
//     console.log(result)
//   })
//   .then()
//   .then(function (result) {
//     console.log(result)
//   })
// var promises = []
//
// for (var i = 0; i < 5; i++) {
//   promises.push(
//     new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve('hahaha')
//       })
//     })
//   )
// }
// promises.push(new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject('errfsdf')
//   })
// }))

// Promise.all(promises)
//   .then((result) => {
//     console.log(result)
//   })
//   .catch(function (err) {
//     console.log(err)
//   })
//
// new Promise(function (resolve, reject) {
//   resolve('dsf')
// })
// .then(function (r) {
//   console.log(r)
// })