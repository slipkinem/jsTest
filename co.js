/**
 * Created by sen.lv on 2021/8/26 at 15:59.
 */
function test () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('fuck')
    }, 1000)
  })
}

function* print () {
  const v = yield test()
  const x = yield test()
  console.log(v)
  console.log(v, x)
}

co(print) // fuck

// 实现 co 方法
function co (gen) {
  let ret = gen.call(this, null)

  auto()

  function auto (r) {
    let o = ret.next(r)
    next(o)
  }

  function next (o) {
    if (o.done) return

    if (o.value instanceof Promise) {
      o.value.then(auto)
    }
  }
}
