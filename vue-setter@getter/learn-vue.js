(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by slipkinem on 2017/2/23.
 */
'use strict'
var Watcher = require('../watcher/watcher')

/**
 * 编译模板
 * @param el
 * @param vm
 * @constructor
 */
function Compile(el, vm) {
  this.$vm = vm
  /**
   * 看是节点还是给的选择器
   * @type {Element}
   */
  this.$el = this.isElementNode(el) ? el : document.querySelector(el)

  if (this.$el) {
    /**
     * 拿到处理后的el
     * @type {*}
     */
    this.$fragment = this.node2Fragment(this.$el)
    this.init() //编译完成后append进图el里面
    this.$el.appendChild(this.$fragment)
  }
}

Compile.prototype = {
  constructor: Compile,

  init: function () {
    this.compileElement(this.$fragment)
  },

  node2Fragment: function (el) {
    /**
     * 创建一个文档片段
     * @type {DocumentFragment}
     */
    var fragment = document.createDocumentFragment(), child

    while (child = el.firstChild) {
      /**
       * 将el的firstChild append进入fragment里面el的firstChild就会消失不见
       * append没有复制
       */
      fragment.appendChild(child)
    }
    return fragment //相当于将el复制过去了
  },

  compileElement: function (el/*this.$fragment*/) {
    var childNodes = el.childNodes, _this = this
    /**
     * 数组化childNodes
     */
    this.slice(childNodes).forEach(function (node) {
      var text = node.textContent //返回node的text(文档)内容

      var reg = /\{\{(.*)\}\}/ // 解析这样的{{}}表达式

      if (_this.isElementNode(node)) {  //如果是节点
        _this.compile(node)
      } else if (_this.isTextNode(node) && reg.test(text)) {  //如果是文本节点 并且reg能匹配到
        _this.compileText(node, RegExp.$1) // 则当做文本节点编译 RegExp.$1返回 /\{\{(.*)\}\}/.test 第一次匹配到的（）里面除了回车的内容
      }
      /**
       * 如果子节点是一个节点，递归调用compileElement
       */
      if (node.childNodes && node.childNodes.length) {
        _this.compileElement(node)
      }

    })
  },

  compile: function (node) {
    var nodeAttrs = node.attributes, _this = this
    //循环节点
    this.slice(nodeAttrs).forEach(function (attr) {

      var attrName = attr.name
      /**
       * 看是否是这样的指令 v- v-model="attr"
       */
      if (_this.isDirective(attrName)) {
        var exp = attr.value //v-on:click="test"  exp=test

        var dir = attrName.substring(2) //dir = on:click/model

        if (_this.isEventDirective(dir)) { //看是不是事件指令 带on的
          compileUtil.eventHandler(node, _this.$vm/*MVVM实例*/, exp, dir)
        } else {
          compileUtil[dir/*model*/] && compileUtil[dir](node, _this.$vm, exp/*attr*/)
        }

        node.removeAttribute(attrName)
      }
    })
  },
  /**
   * 将HTMLCollection变为数组
   * @param nodeAttrs
   * @returns {*}
   */
  slice: function (nodeAttrs) {
    return [].slice.call(nodeAttrs)
  },
  /**
   * 编译文本类节点
   * @param node
   * @param exp
   */
  compileText: function (node, exp/*{{}}匹配的里面的内容*/) {
    compileUtil.text(node, this.$vm/*MVVM的实例*/, exp)
  },

  isDirective: function (attr) {
    return attr.indexOf('v-') === 0
  },

  isEventDirective: function (dir) {
    return dir.indexOf('on') === 0
  },

  isElementNode: function (node) {
    return node.nodeType === 1
  },

  isTextNode: function (node) {
    return node.nodeType === 3
  }

}

var compileUtil = {
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },

  html: function (node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },
  /**
   * v-model
   * @param node
   * @param vm
   * @param exp
   */
  model: function (node, vm, exp/*attr*/) {
    this.bind(node, vm, exp, 'model')

    var _this = this, val = this._getVMVal(vm, exp)

    /**
     * input事件监听处理
     * @param e
     */
    function composeHandle(e) {
      if (!e.target.compose) {
        var newValue = e.target.value

        if (val === newValue)return
        /**
         * 检测input输入变化，更改数据模型
         */
        _this._setVMVal(vm, exp/*v-model=attr*/, newValue)
        val = newValue
      }
    }

    /**
     * input事件对中文输入不兼容 用compose代替
     * vue在处理事件是在compositionend结束时 trigger input事件
     */
    node.addEventListener('compositionstart', function (e) {
      e.target.compose = true;
    })

    node.addEventListener('compositionend', function (e) {
      e.target.compose = false;
      composeHandle(e)
    })

    node.addEventListener('input', function (e) {
      composeHandle(e)
    })

  },

  class: function (node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },

  bind: function (node, vm, exp/*{{.*}}*/, dir/*text*/) {
    var updaterFn = updater[dir + 'Updater'] // textUpdater
    // updaterFn == true 然后执行此函数
    updaterFn && updaterFn(node, this._getVMVal(vm, exp) /*'value'*/)

    /**
     * 将此数据模型添加到watcher列表
     */
    new Watcher(vm/*this*/, exp/*name*/, /*(cb*/function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue)
    }/*)*/)

  },
  /**
   * 事件处理 获取 options里面的method方法，添加到事件监听里面
   * @param node
   * @param vm
   * @param exp
   * @param dir
   */
  eventHandler: function (node, vm/*MVVM*/, exp/*test*/, dir/*v-on:click*/) {  //v-on:click=test
    var eventType = dir.split(':')[1],//click
      fn = vm.$options.method && vm.$options.method[exp] // {method: {test: function}} fn=test => func

    if (eventType && fn) {
      /**
       * 将 v-on:click 里面的click加入事件监听
       */
      node.addEventListener(eventType, fn.bind(vm)/*bind将fn的this指向vm，并返回一个this改变后的函数*/, false)
    }
  },
  /**
   * 获取MVVM数据模型对应属性的值
   * @param vm
   * @param exp
   * @returns {jQuery._data|*}
   * @private
   */
  _getVMVal: function (vm, exp/*{{.*}}*/) {
    var val = vm._data // {name: 'value'}
    exp = exp.split('.') // name => ['name']
    exp.forEach(function (x/*name*/) {
      val = val[x] // 'value'
    })
    return val
  },
  /**
   * 设置数据模型对应属性的值
   * @param vm
   * @param exp
   * @param value
   * @private
   */
  _setVMVal: function (vm, exp/*attr*/, value/*newValue*/) {
    var val = vm._data //options里面的data {}
    exp = exp.split('.')
    exp.forEach(function (k, i) {
      /**
       * data{
       *  attr: {
       *    name: 'heHe'
       *  }
       * }
       * v-model=attr.name
       * 如果exp是attr.name
       * 多属性取值的时候一层一层剥落，再赋值改变的那个属性的值
       */
      if (i/*[0]*/ < exp.length - 1/*1 - 1*/) {
        val = val[k] // val = {name: 'heHe'}
      } else {
        val[k] = value
      }
    })
  }

}


var updater = {
  textUpdater: function (node/*textNode*/, value /*value*/) {
    node.textContent = typeof value === 'undefined' ? '' : value  // {{name}} => 'value'
  },

  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },

  classUpdater: function (node, value, oldValue) {
    var className = node.className

    className = className.replace(oldValue, '').replace(/\s$/, '')
    var space = className && String(value) ? ' ' : ''
    node.className = className + space + value
  },

  modelUpdater: function (node, value, oldValue) {
    node.value = typeof value === 'undefined' ? '' : value
  }
}

module.exports = Compile
},{"../watcher/watcher":5}],2:[function(require,module,exports){
/**
 * Created by slipkinem on 2017/2/24.
 */
window.MVVM = require('./mvvm')


},{"./mvvm":3}],3:[function(require,module,exports){
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
},{"./compile/compile":1,"./observe/observe2":4,"./watcher/watcher":5}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"../observe/observe2":4}]},{},[2]);
