/**
 * 单例模式
 *    只能实例化一次，第二次实例化将之前实例化好的对象返回，这个就可以共享实例的方法
 * Created by slipkinem on 8/17/2017 at 3:45 PM.
 */
'use strict'
var single = (function () {
  var instance = null

  function Fuck (bitch) {
    this.bitch = bitch
  }

  Fuck.prototype.start = function () {
    return this.bitch
  }

  return {
    getInstance: function (bitch) {
      if (!instance) {
        instance = new Fuck(bitch)
      }
      return instance
    }
  }
})()

// 共享一个实例
var s = single.getInstance('fucker')
console.log(s)
var y = single.getInstance('dsfsd')
console.log(y)
console.log(y.start())
