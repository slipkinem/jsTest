/**
 * Created by slipkinem on 12/27/2017 at 10:05 AM.
 */
var esprima = require('esprima')
console.log(JSON.stringify(esprima.parseModule('/***test***/\nimport { sqrt } from "math.js"', {
  range: true
})))
