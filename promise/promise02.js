function isFunction(value) {
  return typeof value === 'function'
}



function Promise(resolver) {
  var promise = this,
    value = null
  promise._resolves = []
  promise._rejects = []
  promise._status = 'PENDING'

  this.then = function (onFulfilled, onRejected) {

    return new Promise(function (resolve, reject) {

      function handle(value) {
        var ret = isFunction(onFulfilled) && onFulfilled(value) || value

        if (ret && isFunction(ret['then'])) {
          ret.then(function (value) {
            resolve(value)
          })
        } else {
          resolve(ret)
        }

      }

      function errBack(reason) {
        reason = isFunction(onRejected) && onRejected(reason) || reason
        reject(reason)
      }

      if (promise._status === 'PENDING') {
        promise._resolves.push(handle)
        promise._rejects.push(errBack)

      } else if (promise._status === 'FULFILLED') {
        handle(value)

      } else if (promise._status === 'REJECTED') {
        errBack(promise._reason)
      }

    })
  }

  function resolve(value) {
    setTimeout(function () {
      promise._status = "FULFILLED";
      promise._resolves.forEach(function (callback) {
        value = callback(value)
      })
    }, 0)
  }

  function reject(value) {
    setTimeout(function () {
      promise._status = 'REJECTED'
      promise._rejects.forEach(function (callback) {
        promise._reason = callback(value)
      })
    }, 0)
  }


  resolver(resolve)

}

Promise.all = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('You must pass an array to all')
  }

  return new Promise(function (resolve, reject) {
    var i = 0,
      result = [],
      len = promises.length,
      count = len

    function resolver(index) {
      return function (value) {
        resolveAll(index, value)
      }
    }

    function rejector(reason) {
      reject(reason)
    }

    function resolveAll(index, value) {
      result[index] = value

      if (--count === 0) {
        resolve(result)
      }

      for (; i < len; i++) {
        promises[i].then(resolver(i), rejector)
      }

    }


  })

}

