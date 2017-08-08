/**
 * Created by slipkinem on 7/13/2017 at 9:40 AM.
 */
'use strict'

/**
 * 模拟Map，不处理edge case
 */
class Map {
  get size () {
    this._size = this._keys.length
    return this._size
  }
  constructor () {
    this._keys = []
    this._values = []
    this._size = 0
  }
  set (key, value) {
    this._keys.push(key)
    this._values.push(value)
    return this
  }
  get (key) {
    return this._values[this._keys.indexOf(key)]
  }
  clear () {
    this._keys = []
    this._values = []
    return this
  }
  delete (key) {
    let index = this._keys.indexOf(key)
    this._keys.splice(index, 1)
    this._values.splice(index, 1)
    return this
  }
  has (key) {
    return this._keys.indexOf(key) !== -1
  }
}

var map = new Map()
map.set(9, 45)
map.set(56, {5: 'dsf'})
// console.log(map)
// console.log(map.get(56))
map.delete(9)
console.log(map.size)
console.log(map.has(56))
console.log(map.has(7))
// map.clear()
// console.log(map)