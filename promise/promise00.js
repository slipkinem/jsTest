/**
 * Created by slipkinem on 2017/3/24.
 */
'use strict'

var promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve('resolve')
  })
})

promise
  .then(function (result) {
    console.log(result)
  })