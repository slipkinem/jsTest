/**
 * 添加异常处理，让程序不容易崩溃
 * Created by slipkinem on 8/9/2017 at 2:26 PM.
 */
'use strict'
var _ = require('lodash')
var log = console.log

var assert = function (exec) {
  log.call(console, exec ? '这是正确的' : '这是错误的')
}
log.err = console.error || log

function noop () {
}

function Scope () {
  // 放置watch的list
  this.$$watchers = []

  // 需要延迟执行的
  this.$$asyncQueue = []

  // 阶段，储存现在在做的信息
  this.$$phase = ''

  // 在digest执行后执行的列队
  this.$$postDigestQueue = []
}

/**
 * 判断引用类型是否也是相等的
 * @param newValue
 * @param oldValue
 * @param valueEq
 * @returns {boolean}
 */
Scope.prototype.$$areEqual = function (newValue, oldValue, valueEq) {
  if (valueEq) {
    return _.isEqual(newValue, oldValue)
  } else {
    /**
     * 因为NaN != NaN 所以如果都是NaN则返回相等
     */
    return newValue === oldValue || (
      typeof newValue === 'number' && typeof oldValue === 'number' && isNaN(newValue) && isNaN(oldValue)
    )
  }
}

/**
 * 设置phase
 * @param phase
 */
Scope.prototype.$beginPhase = function (phase) {
  if (this.$$phase) {
    throw this.$$phase + ' already in progress'
  }
  this.$$phase = phase
}

/**
 * 清除phase
 */
Scope.prototype.$clearPhase = function () {
  this.$$phase = null
}

/**
 * 将需要延迟的推荐async列表，先会执行digest后面的，然后处理async
 * 增加setTimeout处理异步，这样就可以不用将evalAsync写在需要digest的函数里面,不需要手动digest
 * @param expr
 */
Scope.prototype.$evalAsync = function (expr) {
  var _this = this

  if (!_this.$$phase && !_this.$$asyncQueue.length) {
    setTimeout(function () {
      if (_this.$$asyncQueue.length) {
        _this.$digest()
      }
    }, 0)
  }

  this.$$asyncQueue.push({
    scope: this,
    expression: expr
  })
}

/**
 * 将每个监听放入watchers list里面
 * @param watchFn
 * @param listenerFn
 * @param valueEq 是否要深度比较
 */
Scope.prototype.$watch = function (watchFn, listenerFn, valueEq) {
  var _this = this
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || noop,
    valueEq: !!valueEq
  }

  this.$$watchers.push(watcher)

  return function () {
    var index = _this.$$watchers.indexOf(watcher)
    if (index > -1) {
      _this.$$watchers.splice(index, 1)
    }
  }
}
/**
 * 执行$watch进入的函数，并判断返回值有没有改变
 */
Scope.prototype.$$digestOnce = function () {
  var _this = this,
    dirty = false

  this.$$watchers.forEach(function (watcher) {
    try {
      var newValue = _.isFunction(watcher.watchFn) ? watcher.watchFn(_this) : _this[watcher.watchFn],
        oldValue = watcher.last,
        valueEq = watcher.valueEq

      // 对比新旧value，旧value等于最后一个新value, 如果有改变，则执行
      if (!_this.$$areEqual(newValue, oldValue, valueEq)) {
        watcher.listenerFn(newValue, oldValue, _this)
        dirty = true
      }

      watcher.last = (valueEq ? _.cloneDeep(newValue) : newValue)
    } catch (e) {
      log.err(e)
    }
  })

  return dirty

}

/**
 * 循环检测所有的watch列表，防止监听函数自身修改作用域上面的属性，导致检测不到
 */
Scope.prototype.$digest = function () {
  var dirty = false,
    ttl = 10  // 迭代的最大值
  this.$beginPhase('$digest')

  // do while先运行do里面的  while直接判断
  do {
    while (this.$$asyncQueue.length) {
      try {
        var asyncTask = this.$$asyncQueue.shift()
        this.$eval(asyncTask.expression)
      } catch (e) {
        log.err(e)
      }
    }

    dirty = this.$$digestOnce()

    // 设置单次执行digest数为10，防止性能问题
    // !(ttl--) 意思是到达0的时候就是true
    if (dirty && !(ttl--)) {
      this.$clearPhase()
      throw '10 digest iterations reached'
    }
  } while (dirty)

  // 阶段完成
  this.$clearPhase()

  // 执行postDigest
  while (this.$$postDigestQueue.length) {
    try {
      this.$$postDigestQueue.shift()()
    } catch (e) {
      log.err(e)
    }
  }

}

/**
 * 在作用域的上下文执行代码，只是添加上下文立即执行所传入的参数，然后返回值
 * @param expr
 * @param locals
 * @returns {*}
 */
Scope.prototype.$eval = function (expr, locals) {
  return expr(this, locals)
}

/**
 * $apply可以在angular检测不到变动的地方进行手动的检测，依旧可以改变作用域
 * @param expr
 * @returns {*}
 */
Scope.prototype.$apply = function (expr) {
  try {
    this.$beginPhase('$apply')
    return this.$eval(expr)
  } finally {
    this.$clearPhase()
    this.$digest()
  }
}

/**
 * 此函数在下一次digest完成之后调用
 * @param fn
 */
Scope.prototype.$$postDigest = function (fn) {
  this.$$postDigestQueue.push(fn)
}

// test
var scope = new Scope()
scope.testString = '第一次'

scope.$watch('testString', function (nv, ov, scope) {
  log(nv, ov, scope)
})
scope.$digest()

scope.testString = '第二次'
scope.$digest()