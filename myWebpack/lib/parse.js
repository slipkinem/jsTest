/**
 * Created by slipkinem on 12/25/2017 at 4:27 PM.
 */
const esprima = require('esprima')
/**
 * 解析模块包含的依赖
 * 使用esprima将模块文件解析成AST，然后逐个语句进行遍历，找到该模块的依赖
 * @param source
 * @returns {{}}
 */
module.exports = function (source) {
  let ast = esprima.parse(source, {
    range: true
  })
  let module = {}
  walkStatements(module, ast.body)
  module.source = source
  return module
}

/**
 * 分析每一个语句
 * @param module 模块对象
 * @param statement AST语法树
 */
function walkStatement (module, statement) {
  switch (statement.type) {
    case 'VariableDeclaration':
      if (statement.declarations) {
        walVariableDeclarators(module, statement.declarations)
        break
      }
  }
}

/**
 * 遍历模块的语句
 * @param module 模块
 * @param statements AST语法树
 */
function walkStatements (module, statements) {
  statements.forEach(statement => walkStatement(module, statement))
}

/**
 * 处理定义变量的语句
 * @param module 模块对象
 * @param declarators 声明的变量
 */
function walVariableDeclarators (module, declarators) {
  declarators.forEach(declarator => {
    switch (declarator.type) {
      case 'VariableDeclarator':
        if (declarator.init) {
          walkExpression(module, declarator.init)
        }
        break
    }
  })
}

/**
 * 处理表达式
 *
 * @param module
 * @param expression 表达式
 */
function walkExpression (module, expression) {
  switch (expression.type) {
    case 'CallExpression':
      if (
        expression.callee &&
        expression.callee.name === 'require' &&
        expression.callee.type === 'Identifier' &&
        expression.arguments &&
        expression.arguments.length === 1
      ) {
        module.requires = module.requires || []
        let param = Array.from(expression.arguments)[0]
        module.requires.push({
          name: param.value,
          nameRange: param.range
        })
      }
  }
}