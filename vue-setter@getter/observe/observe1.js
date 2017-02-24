/**
 * Created by slipkinem on 2017/2/23.
 */
'use strict'

/**
 * 给data的每一个属性加上数据劫持的set
 * @param data
 */
function observe(data) {
  if (!data || typeof data !== 'object') {
    return
  }

  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key])
  })
}

function defineReactive(data, key, val) {
  observe(val)

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: function () {
      return val
    },
    set: function (newValue) {
      console.log('变化', val, newValue)
      val = newValue
    }
  })
}
var data = {
  name: 'king',
  key: {
    name: 'sdf'
  }
}
observe(data)
data.key.name = 'sdfdsf'
console.log(data)