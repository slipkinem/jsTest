/**
 * Created by slipkinem on 2017/2/13.
 */
'use strict'
/**
 * prototype就是给new出来的实例设置__proto__属性
 * __proto__对应指向对象的原型
 * @param name
 * @param age
 * @constructor
 */
function Person(name, age) {
  this.name = name
  this.age = age
}
/**
 * 用prototype给Person的实例对象上面添加getInfo方法
 */
Person.prototype.getInfo = function () {
  console.log('getInfo', this)
  console.log('name ' + this.name + ' ' + this.age + ' ' + this.job)
}
Person.prototype.job = '学生'
/**
 * new构造函数，创建实例
 * @type {Person}
 */
var lvsen = new Person('LvSen', 22)
/**
 * 创建lvsen实例对象，并用__proto__指向Person的prototype添加的实例方法
 * constructor指向lvsen的super对象
 */
console.log(lvsen.__proto__, lvsen.constructor)
lvsen.getInfo()
/**
 * 创建Men构造函数
 * @param name
 * @param age
 * @param sex
 * @constructor
 */
function Men(name, age, sex) {
  /**
   * 改变this指向，用这个this代替Person去执行 => 相当于 Person.name = name -> this.name = name
   */
  Person.apply(this, [name, age])
  this.sex = sex
}
/**
 * 相当于
 * var person = new Person()
 * person:
 * {
 *   name: undefined,
 *   age: undefined,
 *   getInfo: function () {
 *     console.log('name ' + this.name + ' ' + this.age)
 *   }
 * }
 *
 * Men.prototype = person
 *
 * Men.prototype:
 * {
 *   name: undefined,
 *   age: undefined,
 *   getInfo: function () {
 *     console.log('name ' + this.name + ' ' + this.age)
 *   }
 * }
 * @type {Person}
 */
Men.prototype = new Person()
/**
 * 继续给原型链设置方法/属性
 */
Men.prototype.showSex = function () {
  console.log(this.sex)
}
var lvSen = new Men('lvSen', 22, '男')
lvSen.showSex()
lvSen.getInfo()
/**
 * 因为原型链继承不能带参数，所以属性继承用Constructor.call/apply(this, args/argArray)
 * 方法继承用Constructor.prototype = new Super()
 */


