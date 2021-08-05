/**
 * Created by sen.lv on 2021/6/4 at 14:43.
 */
const updateCompiler = require('./updateCompiler');
const express = require('express')
const socket = require('socket.io')
const http = require('http')
const MemoryFs = require('memory-fs')
const path = require('path')
const mime = require('mime')

class Server {
  constructor (compiler) {
    this.compiler = compiler;
    updateCompiler(compiler);
    this.currentHash = '';
    this.clientSockets = [];
    this.setupApp()
    this.setupHooks()
    this.createSocketServer()
    this.setupDevMiddleware()
    this.routes()
  }

  setupHooks () {
    // webpack编译完成后触发
    this.compiler.hooks.done.tap('webpack-dev-server', (status) => {
      this.currentHash = status.hash;
      // 编译完成通过socket发送hash事件
      this.clientSockets.forEach(socket => {
        socket.emit('hash', status.hash);
        socket.emit('ok');
      });
    });
  }

  setupApp () {
    this.app = express()
  }

  routes() {
    const config = this.compiler.options
    this.app.use(this.middleware(config.output.path))
  }

  setupDevMiddleware() {
    const { compiler } = this
    compiler.watch({}, () => {
      console.log('compiled successfully')
    })

    const fs = new MemoryFs()
    this.fs = compiler.outputFileSystem = fs

    const staticMiddleWare = (fileDir) => {
      return (req, res, next) => {
        let { url } = req;
        if (url === '/favicon.ico') {
          return res.sendStatus(404)
        }
        url === '/' ? url = '/index.html' : null
        let filePath = path.join(fileDir, url)

        let stat = this.fs.statSync(filePath)
        if (stat.isFile()) {
          const content = this.fs.readFileSync(filePath)
          res.setHeader('Content-Type', mime.lookup(filePath))
          res.send(content)
        }
      }
    }

    this.middleware = staticMiddleWare
  }

  createSocketServer () {
    this.server = http.createServer(this.app)
    const io = socket(this.server)
    io.on('connection', socket => {
      console.log('new client connect server')

      this.clientSockets.push(socket)
      socket.on('disconnection', () => {
        const index = this.clientSockets.indexOf(socket)
        this.clientSockets = this.clientSockets.splice(index, 1)
      })

      socket.emit('hash', this.currentHash)
      socket.emit('ok')
    })
  }

  listen (port, host = 'localhost', cb = () => {}) {
    this.server.listen(port, host, cb)
  }

}

module.exports = Server;
