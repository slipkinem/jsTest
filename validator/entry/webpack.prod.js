/**
 * Created by slipkinem on 1/23/2018 at 2:55 PM.
 */
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(common, {
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        },
        {
          loader: 'ts-loader'
        }
      ]
    }]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new UglifyJSPlugin()
  ],
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.min.js'
  }
})