/**
 * Created by slipkinem on 2017/2/23.
 */
'use strict'
/**
 * 在数据的原型进行操作，
 * @type {{}}
 */
var o = {}
/**
 * 我使用Object的规定原型属性方法命令你（对象o）
 * 添加一个属性a
 * 规定属性a的值是32，可枚举，可设置，可重写
 * o.a = 1;
 // 等同于 :
 Object.defineProperty(o, "a", {
    value : 1,
    writable : true,
    configurable : true,
    enumerable : true
  })
 set o.a = 45
 get var oa = o.a 获取o.a的值
 */

Object.defineProperty(o, 'a', {
  value: 32,
  writable: true,
  enumerable: true,
  configurable: true
})

var bValue

Object.defineProperty(o, 'b', {
  get: function () {
    return bValue
  },
  set: function (newValue) {
    console.log(newValue)
    bValue = newValue
  },
  enumerable: true,
  configurable: true
})

o.b = 38
console.log(o.b)