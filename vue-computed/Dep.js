/**
 * Created by slipkinem on 2019/2/28 at 3:37 PM.
 */

export class Dep {
  constructor () {
    this.subs = []
    this.id = Dep.uid++
  }

  static uid = 0
  static targetStack = []
  static target = null

  static pushTarget (watcher) {
    if (Dep.target) {
      Dep.targetStack.push(Dep.target)
    }
    Dep.target = watcher
  }

  static popTarget () {
    Dep.target = Dep.targetStack.pop()
  }

  addSub (watcher) {
    this.subs.push(watcher)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    const subs = this.subs.slice()
    subs.forEach(sub => sub.update())
  }

}
