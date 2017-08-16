/**
 * 面向对象
 * 面向对象就是将需要的功能封装为一个对象，这个对象称之为类
 * 面向对象的特征，封装（就是将私有变量方法封装，不向外暴露），继承（子类继承父类），多态（根据函数的参数等不一样的状态展，构成不一样的方法）
 * Created by slipkinem on 8/16/2017 at 2:19 PM.
 */
'use strict'
let log = console.log.bind(console)

log('----------------------封装，主要是封装私有变量-----------------------')

let Book = function (id, name, price) {
  /**
   * 私有变量
   * @type {number}
   * @private
   */
  let _num = 1
  let _this = this
  this.id = id
  this.name = name
  this.price = price

  /**
   * 私有方法
   */
  function checkId () {
    log(_this.id, _num, _this.price)
  }

  checkId()

  // 公共方法
  this.id = id
}

// 类静态共有属性
Book.face = 'paper'
// 静态方法
Book.fuck = function () {
  log('fuck')
}

// 通过闭包实现封装
let Book2 = (function () {
  // 通过闭包，将属性包起来
  /**
   * 静态变量
   * @type {number}
   * @private
   */
  let _num = 2

  return function (id, name) {
    this.name = name
    this.fuck = function () {
      log(this.name, _num)
    }
  }

})()
let b = new Book2(1, 'test')
b.fuck()

log('-----------------------继承--------------------------')
log('-------类式继承, 引用类型容易和父级绑定到一起，导致问题--------')
~function () {
  let SuperClass = function () {
    this.superValue = true
    this.books = [1, 2, 3, 4]
  }
  SuperClass.prototype.getSuperValue = function () {
    return this.superValue
  }

  function SubClass () {
    this.subValue = false
  }

  SubClass.prototype = new SuperClass()

  SubClass.prototype.getSubValue = function () {
    return this.subValue
  }

  SubClass.prototype.setBook = function () {
    this.books.push('setBook')
  }

  let s = new SubClass()
  let o = new SubClass()
  log('subValue = ' + o.getSubValue(), 'superValue = ' + o.getSuperValue())
  o.setBook()
  s.books.push('jejejej')
  log(o.books, s.books)
}()

log('------构造继承-----')

~function () {
  function SuperClass (id) {
    this.books = [1, 2, 3]
    this.id = id
  }

  SuperClass.prototype.showBooks = function () {
    log(this.books)
  }

  function SubClass (id) {
    // 关键
    SuperClass.call(this, id)
  }

  SubClass.prototype = new SuperClass()

  let o1 = new SubClass(1)
  let o2 = new SubClass(2)

  o1.books.push('34')
  o2.books.push('43')

  o1.showBooks()
  o2.showBooks()

}()

log('------原型继承-----')
~function () {
  function inheritObject (o) {
    function F () {
    }

    F.prototype = o
    return new F()
  }

  function inheritPrototype (subClass, superClass) {
    let p = inheritObject(superClass.prototype)
    p.constructor = subClass
    subClass.prototype = p
  }

  function SuperClass (name) {
    this.name = name
    this.colors = [1, 2, 2, 3]
  }

  SuperClass.prototype.getName = function () {
    return this.name
  }

  function SubClass (name, time) {
    // 会开辟内存，构造函数式继承
    SuperClass.call(this, name)
    this.time = time
  }

  inheritPrototype(SubClass, SuperClass)

  SubClass.prototype.getTime = function () {
    return this.time
  }

  let o1 = new SubClass('23', 3434)
  let o2 = new SubClass('234', 34)

  o1.colors.push('dsfdsf')
  log(o1.colors, o2.colors)

  o1.getName = function () {
    log('324234324')
  }
  o1.getName()
  log(o2.getName())

}()
