/**
 * Created by slipkinem on 2017/3/24.
 */
'use strict'

function Promise(fn) {

  this.deferred = {}

  let _this = this

  function resolve(value) {
    _this.deferred(value)
  }

  fn(resolve)

}

Promise.prototype.then = function (onFulfilled) {
  this.deferred = onFulfilled
}
// 处理人        // 发布承诺人
new Promise(function (resolve) {  // 收到一个承诺（决定执行承诺，执行不了承诺） =》 有佣金
  setTimeout(function () {        // 处理
    resolve('haha')               // 决定执行承诺
  }, 0)
})
  .then(function (haha) {         // 承诺接下来
    console.log(haha)
  })

/**
 * 1. 新建一个promise
 * 2. 处理promise，看能不能执行（接受，拒绝）
 * 3. 注册当执行了承诺拿到数据做的事，错了怎么办（拿到错的数据）
 * 4. 可以执行承诺，决定执行承诺 =》 继续执行 执行承诺后答应的事
 * 5. 最终完成
 */