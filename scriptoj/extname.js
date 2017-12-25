/**
 * Created by slipkinem on 2017/8/14 at 14:08.
 */
'use strict'
const extname = (filename) => {
  /* TODO */
  return (/(.*)(\..*)$/.test(filename.trim()) && RegExp.$1) ? RegExp.$2 : ''
}
console.log(extname('dsf.hello'))