/**
 * Created by slipkinem on 2017/2/6.
 */
'use strict'
// function baseExtend(dst, objs, deep) {
//
//   for (var i = 0, ii = objs.length; i < ii; ++i) {
//     var obj = objs[i];
//
//     var keys = Object.keys(obj);
//     for (var j = 0, jj = keys.length; j < jj; j++) {
//       var key = keys[j];
//       var src = obj[key];
//       dst[key] = src;
//     }
//   }
//   return dst
// }
// var x = [1, 2]
// baseExtend(x, [{name: 34}, {name: 334}, {name: 345435}])
//
// console.log(x)
// function change(json, newKey, oldKey) {
//   json.forEach(function (j) {
//     j[newKey] = j[oldKey]
//     delete j[oldKey]
//   })
// }
// var x = [{
//   sdf: 12
// },{
//   sdf: 12
// }]
//
// change(x, 'sdfsda', 'sdf')
// console.log(x)

// function swapItems(arr, currentIndex, dstIndex) {
//   console.log(arr.splice(dstIndex, 1, arr[currentIndex]))
//   arr[currentIndex] = arr.splice(dstIndex, 1, arr[currentIndex])[0]
//   return arr
// }
//
// var arr = ['11111', 2222222, 3333333, 444444]
// swapItems(arr, 0, 2)
// function test() {
//   console.log('x')
//   return function () {
//     console.log('y')
//   }
// }
// test()()

// var x = function (){
//   this.name = 'sdfsdf'
// }
// x.prototype.show = function(){
//   console.log(this.name)
// }
//
// x.prototype.hehe = function(){
//   // console.log(this.show.bind)
//   setTimeout(this.show.call(this), 5000)
// }
//
// var y = new x
// y.hehe()

function x() {
  console.log('x')
}

setTimeout('x', 0)