/**
 * Created by slipkinem on 8/9/2017 at 9:55 AM.
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
Scope.prototype.$digest = function () {
  var _this = this

  this.$$watchers.forEach(function (watcher) {
    var newValue = watcher.watchFn(_this)
    var oldValue = watcher.last

    // 对比新旧value，旧value等于最后一个新value
    if (newValue !== oldValue) {
      watcher.listenerFn(newValue, oldValue, _this)
    }

    watcher.last = newValue
  })
}

var scope = new Scope()
scope.firstName = 'Joe'
scope.counter = 0

scope.$watch(
  function (scope) {
    return scope.firstName
  },
  function (newValue, oldValue, scope) {
    log(newValue, oldValue, scope)
    scope.counter++
  }
)

console.log(scope.counter === 0)

scope.$digest()
console.log(scope.counter === 1, '测试')

scope.$digest()
scope.$digest()
console.log(scope.counter === 1)

scope.firstName = 'jane你是谁'
scope.$digest()
console.log(scope.counter === 2)