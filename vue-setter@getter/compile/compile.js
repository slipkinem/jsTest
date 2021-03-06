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