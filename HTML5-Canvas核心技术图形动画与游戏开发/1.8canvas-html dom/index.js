/**
 * 橡皮筋式，用户在canvas中选择某个区域，应用程序会将选取的这部分区域放大
 * Created by slipkinem on 8/29/2017 at 2:19 PM.
 */
'use strict'
onload = function () {
  var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    rubberbandDiv = document.getElementById('rubberbandDiv'),
    resetButton = document.getElementById('resetButton'),
    image = new Image(),
    mousedown = {},
    rubberbandRectangle = {},
    dragging = false

  console.log(context.canvas === canvas)

  function rubberbandStart (x, y) {
    mousedown.x = x
    mousedown.y = y

    rubberbandRectangle.left = mousedown.x
    rubberbandRectangle.top = mousedown.y

    moveRubberbandDiv()
    showRubberbandDiv()

    dragging = true

  }

  /**
   * 选择框拉伸
   * @param x
   * @param y
   */
  function rubberbandStrech (x, y) {
    rubberbandRectangle.left = x < mousedown.x ? x : mousedown.x
    rubberbandRectangle.top = y < mousedown.y ? y : mousedown.y

    rubberbandRectangle.width = Math.abs(x - mousedown.x)
    rubberbandRectangle.height = Math.abs(y - mousedown.y)

    moveRubberbandDiv()
    resizeRubberbandDiv()
  }

  /**
   * 选择完毕
   */
  function rubberbandEnd () {
    var box = canvas.getBoundingClientRect()
    try {
      context.drawImage(
        canvas,
        rubberbandRectangle.left - box.left,
        rubberbandRectangle.top - box.top,
        rubberbandRectangle.width,
        rubberbandRectangle.height,
        0, 0, canvas.width, canvas.height
      )
    } catch (e) {
      // do something...
    }

    resetRubberbandRectangle()
    rubberbandDiv.style.width = 0
    rubberbandDiv.style.height = 0

    hideRubberbandDiv()

    dragging = false
  }

  function moveRubberbandDiv () {
    rubberbandDiv.style.top = rubberbandRectangle.top + 'px'
    rubberbandDiv.style.left = rubberbandRectangle.left + 'px'
  }

  function resizeRubberbandDiv () {
    rubberbandDiv.style.width = rubberbandRectangle.width + 'px'
    rubberbandDiv.style.height = rubberbandRectangle.height + 'px'
  }

  function showRubberbandDiv () {
    rubberbandDiv.style.display = 'inline'
  }

  function hideRubberbandDiv () {
    rubberbandDiv.style.display = 'none'
  }

  function resetRubberbandRectangle () {
    rubberbandRectangle = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    }
  }

  canvas.onmousedown = function (e) {
    var x = e.clientX,
      y = e.clientY
    e.preventDefault()
    rubberbandStart(x, y)
  }

  document.onmousemove = function (e) {
    var x = e.clientX,
      y = e.clientY
    e.preventDefault()
    if (dragging) {
      rubberbandStrech(x, y)
    }
  }

  document.onmouseup = function (e) {
    e.preventDefault()
    rubberbandEnd()
  }

  image.onload = function () {
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
  }

  resetButton.onclick = function (e) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
  }

  image.src = './缓存流程.png'
}