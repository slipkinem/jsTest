/**
 * Created by HASEE on 6/10/2017.
 */
function Observer() {
    // 容器，存放subscribe订阅的内容
    this.subscribes = {
    }
}

Observer.prototype = {
    constructor: 'Observer',
    // 往容器放东西
    subscribe: function (eventName, callback) {
        this.subscribes[eventName] = callback
    },
    // 取函数，执行
    publish: function (eventName, stuff) {
        // 把订阅的东西取出来
        // 执行
        this.subscribes[eventName](stuff)
    }
}
module.exports = Observer