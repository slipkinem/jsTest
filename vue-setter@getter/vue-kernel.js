/**
 * Created by slipkinem on 9/7/2017 at 10:15 AM.
 */
'use strict'

function Observer (data) {
  this.data = data
  this.walk(data)
}

Observer.prototype = {
  constructor: Observer,
  walk: function (data) {
    Object.keys(data).forEach(k => {
      if (typeof data[k] === 'object') {
        new Observer(data[k])
      }
      this.convert(k, data[k])
    })
  },
  convert: function (key, val) {
    let _this = this
    Object.defineProperty(this.data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        console.log('这是 ' + key)
        return val
      },
      set: function (newVal) {
        console.log('set val ' + key)
        if (val !== newVal) return
        _this.walk(newVal)
        val = newVal
      }
    })
  }
}

let data = {
  name: 'hehe',
  test: {
    name: 'haha'
  }
}

let app = new Observer(data)

console.log(data.name)
console.log(data.test.name)