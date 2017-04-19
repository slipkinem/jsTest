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
