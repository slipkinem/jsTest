/**
 * Created by sen.lv on 2021/6/4 at 14:32.
 */
const webpack = require('webpack')
const Server = require('./server/Server')
const config = require('./webpack.config')


const compiler = webpack(config)

const server = new Server(compiler)

server.listen(8080, "localhost", () => {
  console.log('server is start')
})
