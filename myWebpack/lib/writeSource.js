/**
 * Created by slipkinem on 12/25/2017 at 6:11 PM.
 */

/**
 * 将依赖模块名替换成依赖模块id
 * @param module 模块对象
 * @returns 替换模块名之后的模块内容字符串
 * */
module.exports = function (module) {
  let replaces = []
  let source = module.source
  if (!module.requires || !module.requires.length) return source

  module.requires.forEach(require => {
    if (!require.nameRange || !require.name || !require.id) return

    let prefix = `/* ${require.name} */`

    replaces.push({
      from: require.nameRange[0],
      to: require.nameRange[1],
      value: prefix + require.id
    })

    // 排序，从后往前替换模块名，这样才能保证正确替换所有的模块
    replaces.sort((a, b) => {
      return b.from - a.from
    })

    // 逐个替换模块名为模块id
    replaces.forEach(replace => {
      let target = source.substring(replace.from, replace.to)
      source = source.replace(target, replace.value)
    })

    return source

  })
}
