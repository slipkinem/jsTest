/**
 * Created by slipkinem on 2017/2/23.
 */
'use strict'

function Compile(el, vm) {
  this.$vm = vm
  this.$el = this.isElementNode(el) ? el : document.querySelector(el)

  if (this.$el) {
    this.$fragment = this.node2Fragment(this.$el)
    this.init()
    this.$el.appendChild(this.$fragment)
  }
}

Compile.prototype = {
  constructor: Compile,

  init: function () {
    this.compileElement(this.$fragment)
  },

  node2Fragment: function (el) {
    var fragment = document.createDocumentFragment(), child

    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  },

  compileElement: function (el) {
    var childNodes = el.childNodes, _this = this

    this.slice(childNodes).forEach(function (node) {
      var text = node.textContent

      var reg = /\{\{(.*)\}\}/

      if (_this.isElementNode(node)) {
        _this.compile(node)
      } else if (_this.isTextNode(node) && reg.test(text)) {
        _this.compileText(node, RegExp.$1)
      }

      if (node.childNodes && node.childNodes.length) {
        _this.compileElement(node)
      }

    })
  },

  compile: function (node) {
    var nodeAttrs = node.attributes, _this = this

    this.slice(nodeAttrs).forEach(function (attr) {

      var attrName = attr.name

      if (_this.isDirective(attrName)) {
        var exp = attr.value

        var dir = attrName.substring(2)

        if (_this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, _this.$vm, exp, dir)
        } else {
          compileUtil[dir] && compileUtil[dir](node, _this.$vm, exp)
        }

        node.removeAttribute(attrName)
      }
    })
  },

  slice: function (nodeAttrs) {
    [].slice.call(nodeAttrs)
  },

  compileText: function (node, exp) {
    compileUtil.text(node, this.$vm, exp)
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

  model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model')

    var _this = this, val = this._getVMVal(vm, exp)

    node.addEventListener('input', function (e) {
      var newValue = e.target.value

      if (val === newValue)return

      _this._setVMVal(vm, exp, newValue)
      val = newValue
    })

  },

  class: function (node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },

  bind: function (node, vm, exp, dir) {
    var updaterFn = updater[dir + 'Updater']

    updaterFn && updaterFn(node, this._getVMVal(vm, exp))

    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue)
    })

  },

  eventHandler: function (node, vm, exp, dir) {
    var eventType = dir.split(':')[1],
      fn = vm.$options.method && vm.$options.method[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },

  _getVMVal: function (vm, exp) {
    var val = vm._data
    exp = exp.split('.')
    exp.forEach(function (x) {
      val = val[x]
    })
    return val
  },

  _setVMVal: function (vm, exp, value) {
    var val = vm._data
    exp = exp.split('.')
    exp.forEach(function (k, i) {

      if (i < exp.length - 1) {
        val = val[k]
      } else {
        val[k] = value
      }
    })
  }

}

var updater = {
  textUpdater: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
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