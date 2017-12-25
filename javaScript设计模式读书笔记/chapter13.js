/**
 * 桥接模式
 *  某些类型由于自身的逻辑，会向多个维度变化，使其不增加复杂度并达到解耦的目的。
 *    * 将一个函数或者类当做一个桥梁，提取公共部分，将实现和抽象通过桥接的方法链接在一起
 *    * 针对多维度变化，可以创建许多个桥梁
 * Created by slipkinem on 8/17/2017 at 3:56 PM.
 */
'use strict'
let log = console.log.bind(console)
function Speed (x, y) {
  this.x  = x
  this.y = y
}

Speed.prototype.run = function () {
  log('run')
}

function Color (cl) {
  this.cl = cl
}

Color.prototype.draw = function () {
  log('draw')
}

function Shape (sp) {
  this.shape = sp
}

Shape.prototype.change = function () {
  log('改变形状')
}

function Speek (word) {
  this.word = word
}

Speek.prototype.say = function () {
  log('fuck')
}

// 创建一座桥梁，在生成 Ball的时候直接 new Ball
function Ball (x, y, c) {
  this.speed = new Speed(x, y)
  this.color = new Color(c)
}

Ball.prototype.init = function () {
  this.speed.run()
  this.color.draw()
}

function People (x, y, f) {
  this.speed = new Speed(x, y)
  this.speek = new Speek(f)
}
People.prototype.init = function () {
  this.speed.run()
  this.speek.say()
}

// 通过桥梁生成实体
var ball = new Ball(1, 2, '#ccc')
ball.init()