/**
 * 代理模式
 *    对于一个对象不能直接引用另一个对象，所以通过代理起个中介作用
 *    没想到这一章讲的是跨域，我的妈呀，这怎么成了设计模式了
 *    跨域解决方案：
 *      1. jsonp 创建script标签获取数据，不能post
 *      2. iframe 通过iframe拿数据，写起来麻烦，还很弱
 *      3. nginx或者其他服务器进行跨域，或者设置http cors
 *      4... 其他
 * Created by slipkinem on 8/17/2017 at 3:56 PM.
 */
'use strict'
