/**
 * Created by slipkinem on 2017/3/28.
 */
'use strict'

var tt = 'x';

(function (global) {
  function isGlobal(variable) {
    return variable in global
  }
  global.isGlobal = isGlobal
}(this));

console.log(global.isGlobal)