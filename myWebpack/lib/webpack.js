/**
 * Created by slipkinem on 12/26/2017 at 11:42 AM.
 */
const path = require('path')
const co = require('co')
const fs = require('fs')
const buildDeps = require('./buildDeps')
const writeChunk = require('./writeChunk')
const templateSingle = fs.readFileSync(path.join(__dirname, 'templateSingle.js'))

module.exports = function (mainModule, options) {
  return co(function* () {
    let depTree = yield buildDeps(mainModule, options)

    let outputJS = generateOutputJS(depTree)
    fs.writeFile(options.output, outputJS, 'utf-8', function (err) {
      if (err) throw err
    })
  }).catch(err => console.log('error => ' + err))
}

function generateOutputJS (depTree) {
  let buffer = []
  buffer.push(templateSingle)
  buffer.push('/******/({\n')

  let chunks = writeChunk(depTree)
  buffer.push(chunks)
  buffer.push('/******/});')
  return buffer.join('')
}