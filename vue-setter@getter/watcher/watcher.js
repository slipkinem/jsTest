/**
 * Created by slipkinem on 2017/2/23.
 */
'use strict'

var Dep = require('../observe/observe2').Dep
/**
 * 观察者
 * @param vm MVVM的实例
 * @param exp expression
 * @param cb callback
 * @constructor
 */
function Watcher(vm/*MVVM实例vm*/, exp/*name*/, cb/*func*/) {
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.depIds = {}
  this.value = this.get() // value
}

Watcher.prototype = {
  constructor: Watcher,
  /**
   * 事件队列的update方法
   */
  update: function () {
    this.run()
  },

  run: function () {
    var value = this.get()
    var oldVal = this.value

    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  },

  addDep: function (dep) {
    /**
     * 判断此dep是不是被添加过
     */
    if (!this.depIds/*{}*/.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep /*记录dep.id防止重复添加到订阅列队*/
    }
  },
  /**
   * 返回value
   * @returns {*}
   */
  get: function () {
    Dep.target = this // Dep
    var value = this.getVMVal() /*value*/
    Dep.target = null
    return value
  },
  /**
   * 进入observe的get，返回需要的val
   * @returns {jQuery._data|*}
   */
  getVMVal: function () {
    var exp = this.exp.split('.') /*[name]*/
    var val = this.vm._data /*{name: 'value'} 取值进入数据拦截*/

    exp.forEach(function (key/*name*/) {
      val = val[key] /*value*/
    })
    return val
  }

}

module.exports = Watcher