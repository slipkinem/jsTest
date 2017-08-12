/**
 * Created by slipkinem on 8/9/2017 at 4:46 PM.
 */
'use strict'
var log = console.log

var render = function (str, data) {
  function escape (html) {
    return String(html)
      .replace(/&(?!\w+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * 动态拼接函数，拼成这个吊样子
     (function(obj,escape) {
      var tpl = 'hello ' + escape(obj['username']) + '.'
      return tpl;
    })
   */
  var tpl = str
    .replace(/<%=([\s\S]+?)%>/g, function (match, code) {
      return "' + escape(obj['" + code + "']) + '"
    })
    .replace(/<%=([\s\S]+?)%>/g, function (match, code) {
      return "' + obj['" + code + "'] + '"
    })

  tpl = "var tpl = '" + tpl + "'\nreturn tpl;"

  var complied = new Function('obj', 'escape', tpl)

  return complied(data, escape)
}

var tpl = 'hello <%=username%>.'
console.log(render(tpl, {
  username: '<script src="node_modules/.3.4.3@bluebird/js/browser/bluebird.js"></script>'
}))