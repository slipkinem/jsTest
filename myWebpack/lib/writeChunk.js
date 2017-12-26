/**
 * Created by slipkinem on 12/25/2017 at 6:30 PM.
 */
const writeSource = require('./writeSource')

module.exports = function (depTree) {
  let modules = depTree.modules
  let buffer = []
  for (let module in modules) {
    if (!modules.hasOwnProperty(module)) continue
    module = modules[module]
    buffer.push('/******/')
    buffer.push(module.id)
    buffer.push(': function(module, exports, require){ \n\n')

    buffer.push(writeSource(module))
    buffer.push('\n\n/******/}, \n/******/\n')
  }
  return buffer.join('')
}
