/**
 * Created by slipkinem on 1/23/2018 at 2:44 PM.
 */
const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common')

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './src',
    port: 9000,
    open: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.min.js'
  }
})