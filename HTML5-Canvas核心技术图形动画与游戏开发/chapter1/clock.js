/**
 * 先画一个时钟
 * context.arc(x,y,r,sAngle,eAngle,counterclockwise);
 *  x  圆的中心的 x 坐标。
 *  y  圆的中心的 y 坐标。
 *  r  圆的半径。
 *  sAngle  起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
 *  eAngle  结束角，以弧度计。
 *  counterclockwise  可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
 * Created by slipkinem on 8/28/2017 at 11:24 AM.
 */
'use strict'

function Clock (id) {
  this.canvas = document.getElementById(id)
  this.ctx = this.canvas.getContext('2d')
  this.FONT_HEIGHT = 15
  this.HEAD_TRUNCATION = this.canvas.width / 25
  this.MARGIN = 35
  this.HOUR_HEAD_TRUNCATION = this.canvas.width / 10
  this.NUMERAL_SPACING = 20
  this.halfWidth = this.canvas.width / 2
  this.halfHeight = this.canvas.height / 2
  this.RADUIS = (this.halfWidth - this.MARGIN) / 2
  this.HEAD_RADUIS = this.RADUIS + this.NUMERAL_SPACING
}

Clock.prototype = {
  constructor: 'Clock',
  drawCircle () {
    this.ctx.beginPath()
    this.ctx.arc(this.halfWidth, this.halfHeight, this.RADUIS, 0, 2 * Math.PI, true)
    this.ctx.stroke()
  },

  drawNumerals () {
    var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      angle = 0,
      numeralWidth = 0
    numerals.forEach(numeral => {
      angle = Math.PI / 6 * (numeral - 3)
      numeralWidth = this.ctx.measureText(numeral).width
      this.ctx.fillText(numeral,
        this.halfWidth + Math.cos(angle) * (this.HEAD_RADUIS) - numeralWidth / 2,
        this.halfHeight + Math.sin(angle) * (this.HEAD_RADUIS) + this.FONT_HEIGHT / 3
      )
    })
  },

  drawCenter () {
    this.ctx.beginPath()
    this.ctx.arc(this.halfWidth, this.halfHeight, 5, 0, Math.PI * 2, true)
    this.ctx.fill()
  },

  drawHand (loc, isHour) {
    var angle = Math.PI * 2 * (loc / 60) - Math.PI / 2,
      handRadius = isHour ? this.RADUIS - this.HEAD_TRUNCATION - this.HOUR_HEAD_TRUNCATION :
        this.RADUIS - this.HEAD_TRUNCATION
    this.ctx.moveTo(this.halfWidth, this.halfHeight)
    this.ctx.lineTo(
      this.halfWidth + Math.cos(angle) * handRadius,
      this.halfHeight + Math.sin(angle) * handRadius
    )
    this.ctx.stroke()
  },

  drawHands () {
    var date = new Date,
      hour = date.getHours()
    hour = hour > 12 ? hour - 12 : hour
    this.drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true)
    this.drawHand(date.getMinutes(), false)
    this.drawHand(date.getSeconds(), false)
  },

  drawClock () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawCircle()
    this.drawCenter()
    this.drawHands()
    this.drawNumerals()
  }
}

onload = function () {
  var c = new Clock('canvas')
  c.ctx.font = c.FONT_HEIGHT + 'px Arial'
  var loop = setInterval(c.drawClock.bind(c), 1000)
}
