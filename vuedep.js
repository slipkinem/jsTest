/**
 * Created by sen.lv on 2021/6/29 at 11:12.
 */
class Dep {
  subs = []

  depend() {
    if (Dep.target) {
      console.log('收集依赖')
      this.subs.push(Dep.target)
    }
  }

  notify() {
    this.subs.forEach(sub => {
      sub && sub.update()
    })
  }

}

class Watcher {
  constructor (data, path, cb) {
    this.vm = data
    this.path = path
    this.cb = cb
    this.value = this.get()
  }

  get() {
    Dep.target = this
    const value = this.vm[this.path]
    Dep.target = undefined
    return value
  }

  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb && this.cb.call(this.vm, this.value, oldValue)
  }
}

function defineReactive (data, name, value) {
  const dep = new Dep()
  Object.defineProperty(data, name, {
    configurable: true,
    enumerable: true,
    get () {
      dep.depend()
      return value
    },
    set (v) {
      if (value === v) return
      value = v
      console.log('更新依赖')
      dep.notify()
    }
  })
}

const data = {
  name: 'test'
}

defineReactive(data, 'name', data.name)

new Watcher(data,'name', (value, oldValue) => {
  console.log(value, oldValue, 'watcher')
})

data.name = '123'
data.name = '1231231231'

// console.log(data.name)]
