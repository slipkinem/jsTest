/**
 * Created by sen.lv on 2021/6/19 at 16:45.
 */
const path = require('path')

module.exports = {
  entry: 'src/entry.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  }
}
