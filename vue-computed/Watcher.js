/**
 * Created by slipkinem on 2019/2/28 at 3:37 PM.
 */
import { Dep } from './Dep'

export class Watcher {
  static uid = 0
  constructor (vm, expOrFn, cb, options) {
    this.vm = vm
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
    } else {
      this.deep = this.user = this.lazy = false
    }

    this.dirty = this.lazy
    this.cb = cb
    this.id = ++Dep.uid
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = this.parsePath(expOrFn)
    }

    this.value = this.lazy ? undefined : this.get()
  }

  get () {
    Dep.pushTarget(this)
    const vm = this.vm

    let value = this.getter.call(vm, vm)
    Dep.popTarget()
    return value
  }

  addDep (dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)

      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  update () {
    if (this.lazy) {
      this.dirty = true
    } else {
      this.run()
    }
  }

  run () {
    const value = this.get()
    const oldValue = this.value
    this.value = value
    if (this.user) {
      this.cb.call(this.vm, value, oldValue)
    } else {
      this.cb.call(this.vm, value, oldValue)
    }
  }

  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  parsePath (path) {
    const bailRE = /[^w.$]/
    if (bailRE.test(path)) return
    const segments = path.split('.')
    return function (obj) {
      segments.forEach((segment, key) => {
        if (!obj) return

        if (key === 0) {
          obj = obj.data[segment]
        } else {
          obj = obj[segment]
        }
      })

      return obj
    }
  }

}
