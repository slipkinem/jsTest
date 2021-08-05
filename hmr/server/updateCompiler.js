/**
 * Created by sen.lv on 2021/6/4 at 17:04.
 */
const path = require('path')

module.exports = (compiler) => {
  const config = compiler.options
  config.entry = {
    main: [
      path.resolve(__dirname, '../client/index.js'),
      path.resolve(__dirname, '../client/hot-dev-server.js'),
      config.entry
    ]
  }

  compiler.hooks.entryOption.call(config.context, config.entry)
}
