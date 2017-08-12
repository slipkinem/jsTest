/**
 * Created by slipkinem on 8/9/2017 at 11:41 AM.
 */
'use strict'
var _ = require('lodash')
var log = console.log.bind(console)
var assert = function (exec) {
  log.call(console, exec ? '这是正确的' : '这是错误的')
}

function noop () {
}

function Scope () {
  // 放置watch的list
  this.$$watchers = []
  // 需要延迟执行的
  this.$$asyncQueue = []
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
 * 将需要延迟的推荐async列表，先会执行digest后面的，然后处理async
 * @param expr
 */
Scope.prototype.$evalAsync = function (expr) {
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
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || noop,
    valueEq: !!valueEq
  }

  this.$$watchers.push(watcher)
}
/**
 * 执行$watch进入的函数，并判断返回值有没有改变
 */
Scope.prototype.$$digestOnce = function () {
  var _this = this,
    dirty = false

  this.$$watchers.forEach(function (watcher) {
    var newValue = watcher.watchFn(_this),
      oldValue = watcher.last,
      valueEq = watcher.valueEq

    // 对比新旧value，旧value等于最后一个新value, 如果有改变，则执行
    if (!_this.$$areEqual(newValue, oldValue, valueEq)) {
      watcher.listenerFn(newValue, oldValue, _this)
      dirty = true
    }

    watcher.last = (valueEq ? _.cloneDeep(newValue) : newValue)
  })

  return dirty

}

/**
 * 循环检测所有的watch列表，防止监听函数自身修改作用域上面的属性，导致检测不到
 */
Scope.prototype.$digest = function () {
  var dirty = false,
    ttl = 10  // 迭代的最大值
  // do while先运行do里面的  while直接判断
  do {
    while (this.$$asyncQueue.length) {
      var asyncTask = this.$$asyncQueue.shift()
      this.$eval(asyncTask.expression)
    }
    dirty = this.$$digestOnce()

    // 设置单次执行digest数为10，防止性能问题
    // !(ttl--) 意思是到达0的时候就是true
    if (dirty && !(ttl--)) {
      throw '10 digest iterations reached'
    }

  } while (dirty)
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
    return this.$eval(expr)
  } finally {
    this.$digest()
  }
}

// test
var scope = new Scope()
scope.asyncEvaled = false

scope.$watch(
  function (scope) {
    return scope.aValue
  },
  function (newValue, oldValue, scope) {
    scope.counter++
    scope.$evalAsync(function (scope) {
      scope.asyncEvaled = true
      log('scope.asyncEvaled = true 第二个')
    })
    log('scope.asyncEvaled 第一个', scope.asyncEvaled)
  }
)

scope.aValue = 'test'
scope.$digest()
log('asyncEvaled digest 第三个', scope.asyncEvaled)