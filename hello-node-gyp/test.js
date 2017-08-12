/**
 * Created by slipkinem on 7/27/2017 at 1:18 PM.
 */
'use strict'
var test = require('./build/Release/test');
test.hello('test', function(data) {
  console.log(data);
});