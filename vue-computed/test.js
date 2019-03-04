/**
 * Created by slipkinem on 2019/3/4 at 1:44 PM.
 */
import { Watcher } from './Watcher.js'
import { observe } from './Observer.js'
import { InitComputed } from './InitComputed.js'

function Vue () {
}

let data = {
  name: 'Hello',
  age: 13
}

let computed = {
  getFullName: () => {
    console.log('----走了computed 之 getFullName')
    console.log('新值为： ' + data.name + ' -  world')
    return data.name + data.age + ' ' + ' - world'
  }
}

let vue = new Vue()
vue.data =  data

let updateComponent = (vm) => {
  data.name
}

new Watcher(vue, updateComponent, () => {})

observe(data)

new InitComputed(vue, computed)

//测试 浏览器console中相继运行一下代码测试
console.log('-----1----')
console.log('test', vue.getFullName)
console.log('-----2----')
console.log('test', vue.getFullName)
console.log('-----3----')
data.name='Hi'
console.log('-----4----')
console.log('test', vue.getFullName)
console.log('-----5----')
console.log('test', vue.getFullName)
