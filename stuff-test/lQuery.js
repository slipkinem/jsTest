/**
 * Created by slipkinem on 2017/2/13.
 */
'use strict'
// var lQuery = function (selector, context) {
//   return lQuery.prototype.init(selector)
// }
// lQuery.prototype = {
//   init: function (selector) {
//     if (selector === 'a')
//       this.age = 18
//     console.dir(this == lQuery.prototype) // true
//     return this
//   },
//   getName: function () {},
//   age: 20
// }
// console.log(lQuery('a').age) // 进入是a，18将20覆盖了
// console.log(lQuery('b').age) // age变为了20

// var lQuery = function (selector, context) {
//   /**
//    * 将init当做构造函数了，返回的this是init的实例
//    */
//   return new lQuery.prototype.init(selector)
// }
//
// lQuery.prototype = {
//   init: function (selector) {
//     if (selector === 'a')
//       this.age = 18
//     console.log(this)
//     return this
//   },
//   getName: function () {},
//   age: 20
// }
// console.log(lQuery('a').age)
// console.log(lQuery('b').age)
// console.log(lQuery('a').getName())

var lQuery = function (selector, context) {
  return new lQuery.fn.init(selector)
}

lQuery.fn = lQuery.prototype = {
  getAge: function () {
    return this.age
  },
  age: 20
}

var init = lQuery.fn.init = function (selector) {
  if (selector == 'a')
    this.age = 18
  // console.log(this)
  return this
}

init.prototype = lQuery.fn

console.log(lQuery('a').age)
console.log(lQuery('b').age)
console.log(lQuery('a').getAge())