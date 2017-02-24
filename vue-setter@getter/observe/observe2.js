/**
 * Created by slipkinem on 2017/2/23.
 */
'use strict'

/**
 * Observe观察者
 * @param data
 * @constructor
 */
function Observe(data) {
  this.data = data
  this.convert(data) //
}

Observe.prototype = {
  /**
   * 循环调用defineReactive初始化数据模型
   * @param data
   */
  convert: function (data) {
    var _this = this
    Object.keys(data).forEach(function (key) {
      _this.defineReactive(data, key, data[key])
    })
  },
  /**
   * 设置数据的set和get
   * @param data
   * @param key
   * @param val
   */
  defineReactive: function (data, key, val) {
    var dep = new Dep()
    /**
     * 看对象的属性值是不是obj，如果是的话继续循环添加此属性值的set,get
     */
    var childObj = observe(val)
    /**
     * 主方法设置对象属性参数：1，obj 2, obj的属性key 3，options{}
     */
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false, // 对象属性不可再使用defineProperty方法
      /**
       * get 比如console.log(a.b) 取值过程调用get方法
       * @returns {*}
       */
      get: function () {
        /**
         * 取值时进入
         */
        if (Dep.target/*this*/) {
          dep.depend()
        }
        return val
      },
      /**
       * set方法就是拦截对象的赋值
       * 比如 var a = {} a.b = 4 “=”这个过程被拦截
       * @param newValue
       */
      set: function (newValue) {
        if (val === newValue) return

        val = newValue
        /**
         * 看新赋值属性值是不是对象，是的话加get set
         */
        childObj = observe(newValue)
        /**
         * 将变化通知给dep
         */
        dep.notify()
      }
    })
  }
}

/**
 * 检测value是否为obj
 * @param value
 * @returns {Observe}
 */
function observe(value) {
  if (!value || typeof value !== 'object') return
  return new Observe(value)
}
/**
 * 身份标示
 * @type {number}
 */
var uid = 0
/**
 * 作为watcher的枢纽，可以看做一个代表，代替Observe向watcher提供改变通知
 * watcher通过Dep添加订阅者
 * subs subscribes
 * @constructor
 */
function Dep() {
  this.id = uid++
  this.subs = [] // 定阅队列
}

Dep.prototype = {
  constructor: Dep,

  /**
   * 添加订阅
   * @param sub
   */
  addSub: function (sub/*{vm: '', exp: 'name', depIds: {}, cb: compile bind函数传过来的cb}*/) {
    this.subs.push(sub/*watcher的实例*/) //给subs列队添加一个
  },

  depend: function () {
    /**
     * watcher的实例
     */
    Dep.target.addDep(this/*dep的实例*/)
  },
  /**
   * 移除订阅
   * @param sub
   */
  removeSub: function (sub) {
    var index = this.subs.indexOf(sub)

    if (!!~index) {
      this.subs.splice(index, 1)
    }
  },
  /**
   * 事件通知/也就是执行订阅的事件 每一个加进订阅列队的个体都有一个update方法
   * 也就是有一个观察者，在watcher里面定义
   */
  notify: function () {
    this.subs.forEach(function (sub /*sub也就是Watcher的实例，拥有update方法*/) {
      /**
       * 数据修改后更新视图
       */
      sub.update()
    })
  }
}
/**
 * 此target指要加入到subs里面的目标
 * @type {null}
 */
Dep.target = null

module.exports = {
  observe: observe,
  Dep: Dep
}