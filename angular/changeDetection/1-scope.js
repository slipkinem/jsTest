/**
 * Created by slipkinem on 8/9/2017 at 9:49 AM.
 */
'use strict'

function Scope () {
  // 放置watch的list
  this.$$watchers = []
}

Scope.prototype.$watch = function (watchFn, listenerFn) {
  var watcher = {
    // watchFn: watchFn,
    listenerFn: listenerFn
  }

  this.$$watchers.push(watcher)
}

Scope.prototype.$digest = function () {
  this.$$watchers.forEach(function (watch) {
    watch.listenerFn()
  })
}

var scope = new Scope()

scope.$watch(function () {
  console.log('watchFn')
}, function () {
  console.log('listenerFn')
})

scope.$digest()
scope.$digest()
scope.$digest()