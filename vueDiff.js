/**
 * Created by sen.lv on 2021/7/21 at 13:57.
 */
const vnode = {
  tag: 'div',
  attrs: { id: 'app' },
  children: [{ tag: 'span', attrs: { id: 'child' }, children: ['1'] }],
};

const vnode2 = {
  tag: 'div',
  attrs: { id: 'app2' },
  children: [{ tag: 'span', attrs: { id: 'child' }, children: ['2'] }],
};

const patchAttr = (oldVNode, VNode, el) => {
  each(oldVNode, (key, val) => {
    if (!VNode[key]) return el.removeAttribute(key)
    if (VNode[key] !== val) {
      el.setAttribute(key, val)
    }
  })
}

const patchNode = (el, oldVnode, vnode) => {
  patchAttr(oldVnode.attrs, vnode.attrs, el)

  if (oldVnode.children && oldVnode.children.length) {
    if (!vnode.children || !vnode.children.length) {
      el.parentNode.removeChild(oldVnode)
    } else {
      patchChildren(el, oldVnode.children, vnode.children)
    }
  }

  el.vnode = vnode
}

const patchChildren = (el, oldChildren, newChildren) => {
  let oldStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let oldStartVnode = oldChildren[0];
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0;
  let newEndIndex = newChildren.length - 1;
  let newStartVnode = newChildren[0]
  let newEndVnode = newChildren[newEndIndex]

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (sameNode(oldStartVnode, newStartVnode)) {
      patchNode(oldStartVnode.el, oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartVnode]
    } else if (sameNode(oldEndVnode, newEndVnode)) {
      patchNode(oldEndVnode.el, oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (sameNode(oldEndVnode, newStartVnode)) {
      oldEndVnode = oldChildren[--oldEndVnode]
      newStartVnode = newChildren[++newStartIndex]
    } else if (sameNode(oldStartVnode, newEndVnode)) {

    } else {

    }
  }
}

function sameNode (oldVnode, vnode) {
  return oldVnode.key === vnode.key && oldVnode.tag === vnode.tag
}

function each (obj, fn) {
  for (let key in obj) {
    fn(key, obj[key])
  }
}
