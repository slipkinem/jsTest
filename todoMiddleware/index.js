// /**
//  * Created by slipkinem on 8/23/2017 at 6:08 PM.
//  */
// 'use strict'
// /**
//  * node.js middleware的作用是将请求一层一层的处理下去，
//  * 只有当next的时候会执行下一个middleware
//  * 即就是middlewares是有一个集合，也是回调的一种用法
//  */
//
// var http = require('http')
// var middlewares = [
//   function (req, res, next) {
//     next()
//   },
//   function (req, res, next) {
//     res.end(req.headers.host)
//     next()
//   }
// ]
//
// function handler (req, res) {
//   var i = 0
//
//   function next (err) {
//     if (err) res.end('error', err.toString())
//     i < middlewares.length && middlewares[i++](req, res, next)
//   }
//
//   next()
// }
//
// http.createServer(handler)
//   .listen(3000)

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  var c = []
  for (var i = 0, ii = s.length; i < ii; i++) {
    var si = s[i]
    if (si === '(') {
      c.push(')')
    } else if (si === '[') {
      c.push(']')
    } else if (si === '{') {
      c.push('}')
    } else if (c.length === 0 || c.pop() !== si) {
      return false
    }
  }
  return c.length === 0
};

console.log(isValid(']'))