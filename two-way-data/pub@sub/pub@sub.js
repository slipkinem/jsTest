/**
 * Created by slipkinem on 2017/2/22.
 */
'use strict'

!function (window, $, undefined) {
  window.DataBind = DataBind

  function DataBinder(object_id) {
    /**
     * 使用jq带的pubSub pub=>trigger sub => subscribe
     * @type {*}
     */
    var pubSub = $({})

    /**
     * bind + uid uid为绑定的标示区别
     * message 为触发的事件
     * @type {string}
     */
    var dataAttr = "bind-" + object_id, message = object_id + ':change'

    /**
     * （绑定）监听事件，如用户输入事件什么的
     * 1，事件名称 2，选择器 3，事件发生时的函数
     * 2. 选择器 =》 可选。规定只能添加到指定的子元素上的事件处理程序（且不是选择器本身，比如已废弃的 delegate() 方法）。
     */
    $(document).on('change keyup', "[data-" + dataAttr + "]", function (event) {
      /**
       * this为触发该事件的元素
       * @type {*}
       */
      var $input = $(this)
      /**
       * 发布message事件 trigger要传递的参数 [param1, param2]
       */
      pubSub.trigger(message, [$input.data(dataAttr)/*获取该属性的值，value="name" 获取到name*/, $input.val()])
    })
    /**
     * 监听绑定message事件
     * 1，事件event对象，2。属性
     */
    pubSub.on(message, function (event, propName, newVal) {
      /**
       * 获取到所有的有data-bind-xx的节点
       */
      $("[data-" + dataAttr + "=" + propName + "]").each(function () {
        var $bound = $(this)

        if ($bound.is("input,textarea,select")) {
          $bound.val(newVal)
        } else {
          $bound.html(newVal)
        }

      })
    })
    return pubSub
  }

  function DataBind(uid) {
    /**
     * 创建pubSub实例
     * @type {DataBinder}
     */
    var binder = new DataBinder(uid),
      user = {
        attributes: {},

        set: function (attrName, val) {
          this.attributes[attrName] = val
          binder.trigger(uid + ':change', [attrName, val, this])
        },

        get: function (attrName) {
          return this.attributes[attrName]
        },

        _binder: binder
      }
    /**
     * 监听set时触发的事件，看是否是直接set的
     * 如果不是直接用user.set(attrName, val)则监听的是$(document).on 发出的事件，则initiator为undefined
     */
    binder.on(uid + ':change', function (e, attrName, newVal, initiator) {
      if (initiator !== user) {

        user.set(attrName, newVal)
      }
    })

    return user
  }
}(this, this.jQuery)
