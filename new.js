/**
 * Created by sen.lv on 2021/9/9 at 11:31.
 */

function newCtor (ctor) {
  const isFunction = (r) => typeof r === 'function'
  const isObject = (r) => typeof r === 'object' && r !== null;

  if(!isFunction(ctor)) throw '构造函数'

  let o = {};
  o.__proto__ = ctor.prototype
  console.log(o)
  let args = Array.prototype.slice.call(o, 1)
  let r = ctor.apply(o, args)
  return isFunction(r) || isObject(r) ? r : o;
}


function company (val, name) {
  this.val = val;
  this.name = name;
}

var company1 = newCtor(company, 'yideng', 'beijing');
console.log('company1: ', company1);
