/**
 * Created by slipkinem on 12/25/2017 at 4:51 PM.
 */
const fs = require('fs')
const path = require('path')
const co = require('co')

module.exports = function (moduleIdentifier, context) {
  return co(function* () {
    let result;

    // 如果是绝对路径，直接执行
    if (path.isAbsolute(moduleIdentifier)) {
      result = yield statPromise(moduleIdentifier)
      return result
    }

    // 模块是相对路径或者模块就在入口js当前目录（直接用文件名调用）
    let absolutePath = path.resolve(context, moduleIdentifier)
    let ext = path.extname(moduleIdentifier)
    absolutePath += ext === '' ? '.js' : ''
    result = yield statPromise(absolutePath)
    if (result) {
      return result
    }

    // 尝试在当前node_modules里面查找
    absolutePath = path.resolve(context, './node_modules', moduleIdentifier)
    absolutePath += ext === '' ? '.js' : ''
    result = yield statPromise(absolutePath)
    return result

  })
}

/**
 * 判断路径文件是否存在
 * @param path 目标文件路径
 * @returns { Promise }
 */
function statPromise (path) {
  return new Promise(resolve => {
    fs.stat(path, function (err, stats) {
      if (stats && stats.isFile) {
        return resolve(path)
      }
      resolve(false)
    })
  })
}