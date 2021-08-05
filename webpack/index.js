/**
 * Created by sen.lv on 2021/6/8 at 13:58.
 */
const fs = require('fs');
const path = require('path')

const createAsset = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');

  const babelParser = require('@babel/parser');

  const ast = babelParser.parse(content, {
    sourceType: 'module',
  });


  const { transformFromAst } = require('@babel/core');

  const { code } = transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  });

  const dependencies = [];

  const traverse = require('@babel/traverse').default;

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value + '.js');
    },
  });

  return {
    code,
    dependencies
  }

}

function createGraph (entry) {
  const mainAsset = createAsset(entry)
  console.log(mainAsset)
  const queue = {
    [entry]: mainAsset
  }

  function recursionDep (filename, assert) {
    assert.mappings = {}

    const dirname = path.dirname(filename)
    assert.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath)

      assert.mappings[relativePath] = absolutePath

      if (!queue[absolutePath]) {
        const child = createAsset(absolutePath)

        queue[absolutePath] = child

        if (child.dependencies.length > 0) {
          recursionDep(absolutePath, child)
        }
      }
    })
  }

  for (let filename in queue) {
    let assert = queue[filename]
    recursionDep(filename, assert)
  }

  return queue
}

function bundle (graph) {
  let modules = ''
  for (let filename in graph) {
    let mod = graph[filename]
    modules += `'${filename}': [
    function(require, module, exports){
      ${mod.code}
    },
    ${JSON.stringify(mod.mapping)}
  ],`
  }


  const result = `
    (function(modules){
      function require(moduleId) {
        const [fn, mapping] = modules[moduleId]
        function localRequire(name) {
          return require(mapping[name])
        }
        const module = {exports: {}}
        fn(localRequire, module, module.exports)
        return module.exports
      }

      require('${entry}')
    })({${modules})
`

  return result
}


const config = require('./minipack.config');
const entry = config.entry;
const output = config.output;

function writeFile (path, result) {
  fs.writeFile(path, result, err => {
    if (err) throw err
    console.log('文件已被返回')
  })
}

const graph = createGraph(entry)
const result = bundle(graph)

fs.access(`${output.path}/${output.filename}`, err => {
  if (!err) {
    writeFile(`${output.path}/${output.filename}`, result)
  } else {
    fs.mkdir(output.path, { recursive: true }, err => {
      if (err) throw err
      writeFile(`${output.path}/${output.filename}`, result)
    })
  }
})

