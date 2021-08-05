/**
 * Created by sen.lv on 2021/6/4 at 17:06.
 */
const hotEmitter = require('./event')
let currentHash;
let lastHash;

hotEmitter.on('webpackHotUpdate', hash => {
  console.log('webpackUpdate,,,,,', hash)
  currentHash = hash
  if (!lastHash) {
    return lastHash = currentHash
  }
  hotCheck()
})

function hotCheck () {
  hotDownloadManifest().then(hotUpdate => {
    console.log(hotUpdate, 'hotUpdate,,,,')
    let chunkIdList = Object.keys(hotUpdate.c)

    chunkIdList.forEach(chunkId => {
      hotDownloadUpdateChunk(chunkId)
    })

    lastHash = currentHash;
  })
}

function hotDownloadManifest () {
  console.log('hotDownloadManifest', lastHash)
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    let hotUpdatePath = `${lastHash}.hot-update.json`
    xhr.open('get', hotUpdatePath)
    xhr.onload = () => {
      let hotUpdate = JSON.parse(xhr.responseText)
      resolve(hotUpdate)
    }
    xhr.onerror = e => reject(e)
    xhr.send()
  })
}

function hotDownloadUpdateChunk (chunkId) {
  let script = document.createElement('script')
  script.charset = 'utf-8';
  script.src = `${chunkId}.${lastHash}.hot-update.js`
  document.head.appendChild(script)
}

function hotCreateModule (moduleId) {
  let hot = {
    accept(deps = [], callback) {
      deps.forEach(dep => {
        hot._acceptedDependencies[dep] = callback || (() => {})
      })
    },
    check: hotCheck
  }
  return hot
}

window.webpackHotUpdate = (chunkId, modules) => {
  Object.keys(modules).forEach(moduleId => {
    const oldModule = __webpack_require__.c[moduleId]
    const newModule = __webpack_require__.c[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
      hot: hotCreateModule(moduleId),
      parents: oldModule.parents,
      children: oldModule.children
    }

    modules[moduleId].call(newModule.exports, newModule, newModule.exports, __webpack_require__)
    newModule.l = true

    console.log(newModule, 'newModule,,,', __webpack_require__)
    newModule.parents && newModule.parents.forEach(parentId => {
      parentModule = __webpack_require__.c[parentId]
      parentModule.hot._acceptedDependencies[moduleId] && parentModule.hot._acceptedDependencies[moduleId]()
    })

  })
}
