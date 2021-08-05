/**
 * Created by sen.lv on 2021/8/5 at 13:56.
 */
function debounce (fn, delay = 500) {
  let timeId = 0;
  return (...args) => {
    if (timeId) clearTimeout(timeId)

    timeId = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
