/**
 * Created by HASEE on 6/10/2017.
 */
function Promise(executor) {
    // 容器，存放then订阅的东西
    this._deferreds = []
    var _this = this
    // 承诺被执行
    function resolve(stuff) {
        // 取出存的东西
        _this._deferreds.forEach(function (callback) {
            // 执行
            callback(stuff)
        })
    }
    executor(resolve)
}

Promise.prototype.then = function (onFulfilled) {
    // 往里面放东西
    this._deferreds.push(onFulfilled)
}

Promise.prototype.catch = function (onFail) {
    this.then(Object.create(null), onFail)
}

module.exports = Promise