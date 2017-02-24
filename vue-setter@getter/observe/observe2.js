// /**
//  * Created by slipkinem on 2017/2/23.
//  */
// 'use strict'
//
// function observe(data) {
//   if (!data || typeof data !== 'object') {
//     return
//   }
//
//   Object.keys(data).forEach(function (key) {
//     defineReactive(data, key, data[key])
//   })
// }
//
// function defineReactive(data, key, val) {
//   var dep = new Dep()
//   observe(val)
//
//   Object.defineProperty(data, key, {
//     enumerable: true,
//     configurable: false,
//     get: function () {
//
//       Dep.target && dep.addDep(Dep.target)
//       return val
//     },
//     set: function (newValue) {
//       if (val === newValue) return
//       console.log('变化', val, newValue)
//       val = newValue
//       dep.notify()
//     }
//   })
// }
//
// /**
//  * Dep添加订阅者
//  * @constructor
//  */
// function Dep() {
//   this.subscribes = []
// }
//
// Dep.prototype = {
//   constructor: Dep,
//   addSubscribe: function (sub) {
//     this.subscribes.push(sub)
//   },
//   notify: function () {
//     this.subscribes.forEach(function (sub) {
//       sub.update()
//     })
//   }
// }
//
// Watcher.prototype  = {
//   get: function (key) {
//     Dep.tagName = this
//     this.value = data[key]
//     Dep.tagget = null
//   }
// }
//
// var data = {
//   name: 'king'
// }
// observe(data)
// data.name = 'llll'

function Observe(data) {
  this.data = data
  this.walk(data)
}

Observe.prototype = {
  walk: function (data) {
    var _this = this
    Object.keys(data).forEach(function (key) {
      _this.convert(key, data[key])
    })
  },

  convert: function (key, val) {
    this.defineReactive(this.data, key, val)
  },

  defineReactive: function (data, key, val) {
    var dep = new Dep()
    var childObj = observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false, // 对象属性不可再使用defineProperty方法
      get: function () {
        if (Dep.target) {
          dep.depend()
        }
        return val
      },
      set: function (newValue) {
        if (val === newValue) return

        val = newValue
        childObj = observe(newValue)
        dep.notify()
      }
    })
  }
}

function observe(value) {
  if (!value || typeof value !== 'object') return
  return new Observe(value)
}

var uid = 0

function Dep() {
  this.id = uid++
  this.subs = []
}

Dep.prototype = {
  constructor: Dep,
  addSub: function (sub) {
    this.subs.push(sub)
  },

  depend: function () {
    Dep.target.addDep(this)
  },

  removeSub: function (sub) {
    var index = this.subs.indexOf(sub)

    if (!!~index) {
      this.subs.splice(index, 1)
    }
  },

  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update()
    })
  }
}

Dep.target = null