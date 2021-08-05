/**
 * Created by sen.lv on 2021/7/22 at 16:38.
 */

// deepFirstSearch
const list = [
  {
    div: {
      attr: 'id1',
      children: [
        {
          p: {
            attr: 'id2',
            children: [
              {
                a: {
                  attr: 'href',
                },
              },
            ],
          },
        },
        {
          div: {
            attr: 'id3',
          },
        },
      ],
    },
  },
];
const attrs = [];

function dfsSearch (list) {
  list.forEach(item => {
    for (let key in item) {
      let val = item[key];
      if (val.attr) {
        attrs.push(val.attr);
        if (val.children) {
          dfsSearch(val.children);
        }
      }
    }
  });
}

// dfsSearch(list);
// console.log(attrs);
// 深度优先遍历采用后入先出队列，要注意从右到左进行循环
function dfsSearchUnUseRecursion (list) {
  let stack = [list[0]];

  while (stack.length !== 0) {
    let nodes = stack.pop();
    for (let key in nodes) {
      let node = nodes[key];
      if (node.attr) attrs.push(node.attr);

      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push(node.children[i]);
        }
      }
    }
  }
}


dfsSearchUnUseRecursion(list);
console.log(attrs);
