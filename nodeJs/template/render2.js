/**
 * Created by slipkinem on 2017/8/14 at 10:05.
 */
~function (global, undefined) {
  'use strict'

  function escape (html) {
    return String(html)
      .replace(/&(?!\w+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function render (tpl, data) {
    tpl = tpl
      .replace(/\{\{@([\s\S]+?)\}\}/g, function (match, field) {
        return '"\n' + field + '\ntpl += "'
      })
      .replace(/\{\{([\s\S]+?)\}\}/g, function (match, field) {
        return '" + escape(' + field + ') + "'
      })
      .replace(/\{\{([\s\S]+?)\}\}/g, function (match, field) {
        return '" + ' + field + ' + "'
      })

    tpl = 'tpl = "' + tpl + '"'
    tpl = 'var tpl = ""\nwith(obj || {}) {\n' + tpl + '\n}\nreturn tpl'

    var compile = new Function('obj', 'escape', tpl)

    return compile(data, escape)
  }

  var tpl = [
    '{{@ for (var i = 0; i < items.length; i++) { }}',
    '{{@ var item = items[i]; }}',
    '<p>{{i+1}}、{{item.name}}</p>',
    '{{@ } }}'
  ].join('')

  console.log(tpl)

  console.log(render(tpl, {
    items: [
      {
        name: 'lvsen'
      },
      {
        name: 'sdjfksdjfk'
      }
    ]
  }))

}(this)
