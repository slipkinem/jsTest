/**
 * 外观模式
 *    这章坑爹，就是说了下兼容性的封装，在写个小小型代码库
 * Created by slipkinem on 8/17/2017 at 3:56 PM.
 */
'use strict'
var A = (function () {
  var o = {
    g: function (id) {
      return document.getElementById(id)
    }
  }
  // todo: 其余不想写了，就是获取元素，添加事件的封装
  return o
}())
