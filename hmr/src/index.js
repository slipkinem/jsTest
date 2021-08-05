/**
 * Created by sen.lv on 2021/6/4 at 14:30.
 */
let inputEl = document.createElement("input");
document.body.appendChild(inputEl);

let divEl = document.createElement("div")
document.body.appendChild(divEl);

let render = () => {
  let content = require("./content").default;
  divEl.innerText = content;
}
render();
console.log('module.hot', module.hot, module)
if (module.hot) {
  module.hot.accept(["./content.js"], render);
}
