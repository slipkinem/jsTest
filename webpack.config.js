/**
 * Created by slipkinem on 2017/3/28.
 */
const path = require('path')

'use strict'
module.exports = {
  entry: './promise/promise.js',
  output: {
    path: path.resolve(__dirname, 'promise'),
    filename: 'promise.dist.js',
    library: "Promise",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      }
    ]
  }
}