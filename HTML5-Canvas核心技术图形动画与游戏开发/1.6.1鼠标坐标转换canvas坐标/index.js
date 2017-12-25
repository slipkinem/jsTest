/**
 * js鼠标事件获取的坐标是基于浏览器视窗的坐标，而在canvas中需要获取到鼠标基于canvas的坐标
 *
 * Created by slipkinem on 8/29/2017 at 11:43 AM.
 */
'use strict'

/**
 * 页面坐标转canvas坐标
 * @param canvas canvas对象
 * @param x 鼠标x
 * @param y 鼠标y
 * @returns {{x: number, y: number}}
 */
function windowToCanvas (canvas, x, y) {
  var box = canvas.getBoundingClientRect() // 获取canvas实际显示的可能被css控制的属性
  console.dir(canvas)
  console.dir(box)
  // box.left 元素左边距离页面左边的距离
  // box.right 元素右边距离页面左边的距离
  // box.width 带边框的宽
  // 鼠标获取的是css坐标，需要求出来的是canvas坐标
  // canvas的width和css设置的width表现是不一样的(UA展现效果)
  // canvas的width是绘图容器的宽，css是canvas元素的宽(包括padding,border,width(px))
  // canvas.width / box.width 求出canvas的宽占元素宽的比例 x
  // x * box.left 求出canvas绘图容器和屏幕左边的距离，然后求出canvas实际的坐标
  return {
    x: x - box.left * (canvas.width / box.width),
    y: y - box.top * (canvas.height / box.height)
  }
}

onload = function () {
  document.getElementById('canvas').onclick = function (e) {
    console.log(windowToCanvas(this, e.clientX, e.clientY))
  }
}