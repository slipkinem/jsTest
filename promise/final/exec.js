/**
 * Created by slipkinem on 2017/3/28.
 */
'use strict'
var Promise = require('./promise.dist').Promise

console.log(Promise)

function tr(index) {
  return new Promise(function (resolve, reject) {
    if (index === 0) {
      resolve('re')
    } else {
      reject('eeeee')
    }
  })
}

tr(2)
  .then(function (r) {
    console.log(r)
  })
  .catch(function (r) {
    console.log(r)
  })