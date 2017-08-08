/**
 * Created by slipkinem on 2017/5/3.
 */
(function (global) {
  'use strict'
  function noop() {
  }

  var moduleSet = {}
  var fileSet = {}

  function isDefined(exp) {
    return typeof exp !== 'undefined'
  }

  var ls = {
    define: function (name, dependencies, factory) {
      if (!moduleSet[name]) {
        moduleSet[name] = {
          name: name,
          dependencies: dependencies,
          factory: factory
        }
      }
      return moduleSet[name]
    },

    invoke: function (name) {
      var module = moduleSet[name]

      // entity里面保存return出来的
      if (!isDefined(module.entity)) {
        // 保存参数执行后的返回值
        var args = []
        for (var i = 0, ii = module.dependencies.length; i < ii; i++) {
          var dependenciesModule = moduleSet[module.dependencies[i]]
          if (isDefined(dependenciesModule.entity)) {
            // 如果依赖里面的函数已经被执行过了，那么就会拿到返回值，传进参数
            args.push(dependenciesModule.entity)
          } else {
            // 让每个依赖的函数都去执行，拿到依赖函数执行后的entity
            var dependenciesEntity = ls.invoke(module.dependencies[i])
            args.push(dependenciesEntity)
          }
        }
        module.entity = module.factory.apply(noop, args)
      }

      return module.entity
    },

    require: function (uriList, callback) {
      for (var i = 0, ii = uriList.length; i < ii; i++) {
        var path = uriList[i]

        if (!fileSet[path]) {
          var head = document.getElementsByTagName('head')[0]
          var node = document.createElement('script')
          node.src = uriList[i].indexOf('.js') ? path : path + '.js'
          node.async = 'true'
          node.onload = function () {
            fileSet[path] = true
            head.removeChild(node)
            checkAllFiles()
          }
          head.appendChild(node)
        }
      }

      function checkAllFiles() {
        var allLoad = true
        for (var i = 0; i < uriList.length; i++) {
          if (!fileSet[uriList[i]]) {
            allLoad = false
            break
          }
        }

        allLoad && callback()

      }

    }

  }
  global.ls = ls
}(this))