~function (global, undefined) {
  // 转义
  var escape = function (html) {
    return String(html)
      .replace(/&(?!\w+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  /**
   * 渲染模板
   * @param tpl
   * @param data
   */
  var render = function (tpl, data) {
    tpl =
      tpl
        .replace(/\n/g, '\\n')
        .replace(/\{\{([\s\S]+?)\}\}/g, function (match, field) {
          console.log('" + escape(obj["' + field + '"]) + "')
          return '" + escape(obj["' + field + '"]) + "'
        })
        .replace(/\{\{([\s\S]+?)\}\}/g, function (match, field) {
          return '" + obj["' + field + '"] + "'
        })
        .replace(/\{\{=([\s\S]+?)\}\}/g, function (match, field) {
          return '"\n' + code + '\ntpl+="'
        })
        .replace(/\'\n/g, '\'')
        .replace(/\n\'/gm, '\'')

    /**
     * "'hello' + escape(obj["username"]) + escape(obj["test"])"
     * @type {string}
     */

    tpl = 'tpl = "' + tpl + '";'
    tpl = 'var tpl = "' + tpl + '"\nreturn tpl'

    var compiled = new Function('obj', 'escape', tpl)
    return compiled(data, escape)
  }

  var tpl = 'hello {{username}} {{=haha}} {{test}}.'
  console.log(render(tpl, {
    username: '<script src="node_modules/.3.4.3@bluebird/js/browser/bluebird.js"></script>',
    haha: 'hahahahaha',
    test: 'testtesttets'
  }))

}(this)