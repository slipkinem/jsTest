/**
 * Created by slipkinem on 2017/2/24.
 */
'use strict'
var Compile = require('./compile/compile')
var observe = require('./observe/observe2').observe
var Watcher = require('./watcher/watcher')

function MVVM(options) {
  /**
   * 获取实例模型的设置
   */
  this.$options = options
  var data = this._data = this.$options.data // {name: 'value'}
  var _this = this

  Object.keys(data).forEach(function (key/*name*/) {
    _this._proxy(key)
  })
  /**
   * 给data的所有属性加上get/set 数据拦截
   */
  observe(data)

  this.$compile = new Compile(options.el || document.body, this/*vm*/)
}

MVVM.prototype = {
  constructor: MVVM,

  $watch: function (key, cb, options) {
    new Watcher(this, key, cb)
  },
  /**
   * 给vm设置vm._data的属性
   * @param key
   * @private
   */
  _proxy: function (key/*name*/) {
    var _this = this
    /**
     * vm[key] = vm.data[key]
     * 在这里vm有和vm.data一样的属性key，当给vm[key]，set,get的时候
     * 代理到vm.data 但显示的看vm[key]是没有值的
     * 起到代理的作用可以方便传值
     */
    Object.defineProperty(_this/*MVVM的实例vm*/, key/*name*/, {
      configurable: false,
      enumerable: true,

      get: function () {
        return _this._data[key]
      },

      set: function (newValue) {
        _this._data[key] = newValue
      }
    })
  }
}

module.exports = MVVM