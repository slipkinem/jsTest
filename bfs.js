/**
 * Created by sen.lv on 2021/7/23 at 16:28.
 */
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
                  attr: 'id4',
                  children: [
                    {
                      span: {
                        attr: 'id6'
                      }
                    }
                  ]
                },
              },
            ],
          },
        },
        {
          div: {
            attr: 'id3',
            children: [
              {
                div: {
                  attr: 'id5'
                }
              }
            ]
          },
        },
      ],
    },
  },
];
const attrs = []

function breadthFirstSearch (list) {
  const stack = [list[0]]

  while (stack.length !== 0) {
    const nodes = stack.shift()

    for (let key in nodes) {
      const node = nodes[key]
      if (node.attr) attrs.push(node.attr)

      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          stack.push(node.children[i])
        }
      }
    }
  }
}
breadthFirstSearch(list)
console.log(attrs)
