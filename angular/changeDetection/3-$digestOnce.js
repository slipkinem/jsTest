/**
 * Created by slipkinem on 8/9/2017 at 10:15 AM.
 */
'use strict'
var log = console.log.bind(console)

function noop () {
}

function Scope () {
  // 放置watch的list
  this.$$watchers = []
}

/**
 * 将每个监听放入watchers list里面
 * @param watchFn
 * @param listenerFn
 */
Scope.prototype.$watch = function (watchFn, listenerFn) {
  var watcher = {
    watchFn: watchFn,
    listenerFn: listenerFn || noop
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
    var newValue = watcher.watchFn(_this)
    var oldValue = watcher.last

    // 对比新旧value，旧value等于最后一个新value
    if (newValue !== oldValue) {
      watcher.listenerFn(newValue, oldValue, _this)
      dirty = true
    }

    watcher.last = newValue
  })

  return dirty

}

/**
 * 循环执行所有的watch列表，防止连个watch的情况不改变
 */
Scope.prototype.$digest = function () {
  var dirty = false,
    ttl = 10 // 迭代的最大值
  // do while先运行do里面的  while直接判断
  do {
    dirty = this.$$digestOnce()

    // 设置单次执行digest数为10，防止性能问题
    // !(ttl--) 意思是到达0的时候就是true
    if (dirty && !(ttl--)) {
      throw '10 digest iterations reached'
    }

  } while (dirty)
}

var scope = new Scope()
scope.counter1 = 0
scope.counter2 = 0

/**
 * 1改变会触发2的改变
 * 然后执行2
 * 2触发1的改变
 * 然后执行1
 * 死循环
 */

scope.$watch(
  function (scope) {
    return scope.counter1
  },
  function (newValue, oldValue, scope) {
    // log(newValue, oldValue, scope)
    scope.counter2++
  }
)

scope.$watch(
  function (scope) {
    return scope.counter2
  }, function (newValue, oldValue, scope) {
    scope.counter1++
  }
)

scope.$digest()

log(scope.counter1)