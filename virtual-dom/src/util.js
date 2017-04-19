/**
 * Created by slipkinem on 2017/2/10.
 */
'use strict'
var _ = exports

_.type = function (obj) {
  /**
   * 可以将string转化为String
   * 这样写更容易判断func,Array等这类Object
   */
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
}

_.isArray = function (list) {
  return _.type(list) === 'Array'
}

_.slice = function (arrayLike, index) {
  return Array.prototype.slice.call(arrayLike, index)
}

_.truthy = function (value) {
  return !!value
}

_.isString = function (list) {
  return _.type(list) === 'String'
}

_.each = function (iterator, func) {
  for (var index in iterator) {
    func(iterator[index], index)
  }
}

_.toArray = function (listLike) {
  if (!listLike) {
    return []
  }
  var list = []

  for (var i in listLike) {
    list.push(listLike[i])
  }
  return list
}

_.setAttr = function (node, key, value) {
  switch (key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      var tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea') {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}
