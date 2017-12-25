/**
 * Created by slipkinem on 12/25/2017 at 4:50 PM.
 */
const fs = require('fs')
const co = require('co')
const parse = require('./parse')
const _resolve = require('./resolve')
let mid = 0

module.exports = function (mainModule, options) {
  let depTree = {
    modules: {}, // 存储模块对象
    mapModuleNameToId: new Map() // 映射模块名到模块ID之间的关系
  }

  return co(function* () {
    depTree = yield parseModule(depTree, mainModule, options.context)
    return depTree
  })
}

/**
 * 将模块解析为一个树状的结构
 * @param depTree 依赖树
 * @param moduleName 模块名称
 * @param context 上下文
 * @returns {*}
 */
function parseModule (depTree, moduleName, context) {
  let module;
  return co(function* () {
    // 查找模块（可能存在向上遍历查找的情况）
    let absoluteFileName = yield _resolve(moduleName, context)

    if (!absoluteFileName) {
      throw `找不到模块${moduleName}`
    }

    // 使用路径确保模块key的唯一性
    module = depTree.modules[absoluteFileName] = {
      id: mid++,
      fileName: absoluteFileName,
      name: moduleName
    }

    // 解析模块
    let source = fs.readFileSync(absoluteFileName).toString()
    let parsedModule = parse(source)
    module.requires = parsedModule.requires || []
    module.source = parsedModule.source

    // 写入映射关系
    depTree.mapModuleNameToId.set(moduleName, mid - 1)

    // 如果此模块有依赖的模块，采取深度遍历的原则，遍历解析其依赖的模块
    let requireModules = parsedModule.requires
    if (requireModules && requireModules.length > 0) {
      for (let require of requireModules) {
        depTree = yield parseModule(depTree, require.name, context)
      }

      // 写入依赖模块的id,生成目标JS文件的时候用
      requireModules.forEach(require => {
        require.id = depTree.mapModuleNameToId.get(require.name)
      })
    }
    return depTree
  })
}
