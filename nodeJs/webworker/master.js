/**
 * Created by slipkinem on 8/10/2017 at 2:17 PM.
 */
'use strict'
var fork = require('child_process').fork
var cpus = require('os').cpus()

for (var i = 0; i < cpus.length; i++) {
  fork('./webworker.js')
}
