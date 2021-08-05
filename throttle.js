/**
 * Created by sen.lv on 2021/8/5 at 13:57.
 */
// function throttle (fn, delay = 500) {
//   let timeId = 0;
//
//   return function(...args) {
//     if (!timeId) {
//       setTimeout(() => {
//         fn.apply(this, args)
//         timeId = 0;
//       }, delay)
//     }
//   }
// }

function throttle (fn, delay = 500) {
  let time = Date.now();

  return function (...args) {
    let now = Date.now()
    if (now - time >= delay) {
      fn.apply(this, args)
      time = now;
    }
  }
}
