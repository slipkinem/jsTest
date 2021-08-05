/**
 * Created by sen.lv on 2021/6/4 at 14:32.
 */
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
