(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by slipkinem on 2017/2/13.
 */
'use strict'
exports.el = require('./src/element')
exports.diff = require('./src/diff')
exports.patch = require('./src/patch')
},{"./src/diff":4,"./src/element":5,"./src/patch":6}],2:[function(require,module,exports){
module.exports = require('./lib/diff').diff

},{"./lib/diff":3}],3:[function(require,module,exports){
/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function diff (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // a simulate list to manipulate
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  var simulateList = children.slice(0)

  // remove items no longer exist
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }

    i++
  }

  function remove (index) {
    var move = {index: index, type: 0}
    moves.push(move)
  }

  function insert (index, item) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item, key) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

exports.makeKeyIndexAndFree = makeKeyIndexAndFree // exports for test
exports.diff = diff

},{}],4:[function(require,module,exports){
/**
 * Created by slipkinem on 2017/2/15.
 */
'use strict'

var _ = require('./util')
var path = require('./patch')
var listDiff = require('list-diff2')

function diff(oldTree, newTree) {
  var index = 0
  var patches = {}
  dfsWalk(oldTree, newTree, index, patches)
  return patches
}

function dfsWalk(oldNode, newNode, index, patches) {
  var currentPatch = []

  // Node is removed.
  if (newNode === null) {
    // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
    // TextNode content replacing
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    if (newNode !== oldNode) {
      currentPatch.push({type: patch.TEXT, content: newNode})
    }
    // Nodes are the same, diff old node's props and children
  } else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    // Diff props
    var propsPatches = diffProps(oldNode, newNode)
    if (propsPatches) {
      currentPatch.push({type: patch.PROPS, props: propsPatches})
    }
    // Diff children. If the node has a `ignore` property, do not diff children
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )
    }
    // Nodes are not the same, replace the old node with new node
  } else {
    currentPatch.push({type: patch.REPLACE, node: newNode})
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  var diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    var reorderPatch = {type: patch.REORDER, moves: diffs.moves}
    currentPatch.push(reorderPatch)
  }

  var leftNode = null
  var currentNodeIndex = index
  _.each(oldChildren, function (child, i) {
    var newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches)
    leftNode = child
  })
}

function diffProps(oldNode, newNode) {
  var count = 0
  var oldProps = oldNode.props
  var newProps = newNode.props

  var key, value
  var propsPatches = {}

  // Find out different properties
  for (key in oldProps) {
    value = oldProps[key]
    if (newProps[key] !== value) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  // Find out new property
  for (key in newProps) {
    value = newProps[key]
    if (!oldProps.hasOwnProperty(key)) {
      count++
      propsPatches[key] = newProps[key]
    }
  }

  // If properties all are identical
  if (count === 0) {
    return null
  }

  return propsPatches
}

function isIgnoreChildren(node) {
  return (node.props && node.props.hasOwnProperty('ignore'))
}

module.exports = diff
},{"./patch":6,"./util":7,"list-diff2":2}],5:[function(require,module,exports){
'use strict'
var _ = require('./util')
/**
 * 节点
 * <ul id="test-id">
 *   <li class="test-class">子节点1</li>
 *   <li class="test-class">子节点2</li>
 * </ul>
 *
 * var element = new Element('ul', {id: 'test-class'}, [
 *  new Element('li', {class: 'test-class'}, ['子节点1']),
 *  new Element('li', {class: 'test-class'}, ['子节点2']),
 * ])
 * var el = element.render()
 * document.body.appendChild(el)
 * @param tagName 节点名称（div, ul之类）
 * @param props （此节点的属性，以对象表示，{type: button}）
 * @param children (子节点，以数组表示[])
 * @constructor
 */
function Element(tagName, props, children) {
  if (!(this instanceof Element)) {
    if (!_.isArray(children) && children !== null) {
      children = _.slice(arguments, 2).filter(_.truthy)
    }
    return new Element(tagName, props, children)
  }

  if (_.isArray(props)) {
    children = props
    props = {}
  }

  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = props ? props.key : void 'fuck'

  var count = 0

  _.each(this.children, function (child, index) {
    if (child instanceof Element) {
      count += child.count
    } else {
      children[index] = '' + child
    }
    count++
  })

  this.count = count
}
/**
 * render，读取DOM结构
 * @returns {Element}
 */
Element.prototype.render = function () {
  var el = document.createElement(this.tagName)
  var props = this.props

  for (var propName in props) {
    var propValue = props[propName]
    _.setAttr(el, propName, propValue)
  }
  _.each(this.children, function (child) {
    var childEl = child instanceof Element ? child.render() : document.createTextNode(child)
    el.appendChild(childEl)
  })

  return el
}

module.exports = Element

},{"./util":7}],6:[function(require,module,exports){
/**
 * Created by slipkinem on 2017/2/15.
 */
'use strict'
var _ = require('./util')

var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

function patch(node, patches) {
  var walker = {index: 0}
  dfsWalk(node, walker, patches)
}

function dfsWalk(node, walker, patches) {
  var currentPatches = patches[walker.index]

  var len = node.childNodes
    ? node.childNodes.length
    : 0
  for (var i = 0; i < len; i++) {
    var child = node.childNodes[i]
    walker.index++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches(node, currentPatches) {
  _.each(currentPatches, function (currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        var newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case PROPS:
        setProps(node, currentPatch.props)
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          // fuck ie
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  })
}

function setProps(node, props) {
  for (var key in props) {
    if (props[key] === void 666) {
      node.removeAttribute(key)
    } else {
      var value = props[key]
      _.setAttr(node, key, value)
    }
  }
}

function reorderChildren(node, moves) {
  var staticNodeList = _.toArray(node.childNodes)
  var maps = {}

  _.each(staticNodeList, function (node) {
    if (node.nodeType === 1) {
      var key = node.getAttribute('key')
      if (key) {
        maps[key] = node
      }
    }
  })

  _.each(moves, function (move) {
    var index = move.index
    if (move.type === 0) { // remove item
      if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
        node.removeChild(node.childNodes[index])
      }
      staticNodeList.splice(index, 1)
    } else if (move.type === 1) { // insert item
      var insertNode = maps[move.item.key]
        ? maps[move.item.key] // reuse old item
        : (typeof move.item === 'object')
          ? move.item.render()
          : document.createTextNode(move.item)
      staticNodeList.splice(index, 0, insertNode)
      node.insertBefore(insertNode, node.childNodes[index] || null)
    }
  })
}

patch.REPLACE = REPLACE
patch.REORDER = REORDER
patch.PROPS = PROPS
patch.TEXT = TEXT

module.exports = patch
},{"./util":7}],7:[function(require,module,exports){
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

},{}]},{},[1]);
