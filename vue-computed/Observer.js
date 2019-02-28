/**
 * Created by slipkinem on 2019/2/28 at 3:37 PM.
 */

import { Dep } from './Dep'

export function def (obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: true,
    writable: true,
    configurable: true
  })
}

function observe (value) {
  if (typeof value !== 'object') return
  return new Observer(value)
}

function defineReactive (obj, key, val) {
  const dep = new Dep()
  let childOb = observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      console.log('调用get获取值，值为：' + val)
      const value = val
      if (Dep.target) {
        dep.depend()

        if (childOb) {
          childOb.dep.depend()
        }
      }

      return value
    },
    set: function reactiveSetter (newVal) {
      console.log('调用了set，值为：' + newVal)
      const value = val
      val = newVal
      childOb = observe(newVal)
      // 通知dep调用，循环调用依赖，进行视图更新
      dep.notify()
    }
  })
}

export class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()

    def(value, '__ob__', this)
    if (Array.isArray(value)) {

    } else {
      this.walk(value)
    }
  }

  walk (obj) {
    const keys = Object.keys(obj)
    keys.forEach(key => {
      if (key === '__ob__') return

    })
  }


}
