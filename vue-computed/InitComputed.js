/**
 * Created by slipkinem on 2019/2/28 at 5:02 PM.
 */
import { Watcher } from './Watcher'

const noop = () => {
}
const computedWatcherOptions = {
  lazy: true
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export class InitComputed {
  constructor (vm, computed) {
    const watchers = vm._computedWatchers = Object.create(null)

    for (const key in computed) {
      const userDef = computed[key]

      let getter = typeof userDef === 'function' ? userDef : userDef.get

      watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)
      if (!(key in vm)) {
        this.defineComputed(vm, key, userDef)
      }
    }
  }

  defineComputed (target, key, userDef) {
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = this.createComputedGetter(key)
      sharedPropertyDefinition.set = noop
    } else {
      sharedPropertyDefinition.get = userDef.get ?
        userDef.cache !== false ?
          this.createComputedGetter(key) :
          userDef.get : noop

      sharedPropertyDefinition.set = userDef.set ? userDef.set : noop
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
  }

  createComputedGetter (key) {
    return function computedGetter () {
      const watcher = this._computedWatchers && this._computedWatchers[key]
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate()
        }

        if (Dep.target) {
          watcher.depend()
        }

        return watcher.value
      }
    }


  }


}
