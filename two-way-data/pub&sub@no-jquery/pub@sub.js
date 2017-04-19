/**
 * Created by slipkinem on 2017/2/22.
 */
/**
 * 所谓观察者模式 publish/subscribe
 * subscribe事件订阅/事件监听 就是将事件和事件的callback，添加到一个需要监听执行事件队列里面
 *   {
 *     eventName: [callback1, callback1],
 *     eventName: [callback]
 *   }
 * 接收到publish发布事件就是将subscribe的事件从队列拿出来执行
 * 在外看来就像是一直在监测这个事件，然后接收到publish发布的，执行监测的事件callback
 *
 */

var dataBind =  function (window) {
  'use strict'
  window.User = User

  /**
   * 绑定数据
   * @param objectId
   * @returns {{callbacks: {}, on: on, publish: publish, off: off}}
   * @constructor
   */
  function DataBinder(objectId) {

    var pubSub = {

        callbacks: {},

        on: function (msg, callback) {
          this.callbacks[msg] = this.callbacks[msg] || []
          this.callbacks[msg].push(callback)
        },

        publish: function (msg) {
          this.callbacks[msg] = this.callbacks[msg] || []

          for (var i = 0, ii = this.callbacks[msg].length; i < ii; i++) {
            /**
             * 用apply来进行柯里化操作
             */
            this.callbacks[msg][i].apply(this, arguments)
          }
        },

        off: function (eventName, callbacks) {
          eventName += ':change'

          var listenerCallbacks = this.callbacks[eventName],
            cbs = []
          if (!listenerCallbacks) {
            return false
          }

          if (!callbacks) {
            delete this.callbacks[eventName]
          } else {

            if (!Array.isArray(callbacks)) {
              cbs.push(callbacks)

            } else {

              for (var i = 0, ii = listenerCallbacks.length; i < ii; i++) {

                for (var j = 0, jj = cbs.length; j < jj; j++) {

                  if (listenerCallbacks[i] === cbs[j]) {
                    listenerCallbacks.splice(i, 1)
                  }
                }
              }

            }
          }
        }
      },

      dataAttr = 'data-bind-' + objectId,
      message = objectId + ':change',

      changeHandle = function (event) {
        var target = event.target || event.srcElement,
          propName = target.getAttribute(dataAttr)

        if (propName && propName !== '') {
          pubSub.publish(message, propName, target.value)
        }
      }

    if (document.addEventListener) {
      document.addEventListener('change', changeHandle, false)
    } else {
      document.attachEvent('onChange', changeHandle)
    }

    pubSub.on(message, function (evt, propName, newVal) {
      var elements = document.querySelectorAll('[' + dataAttr + '=' + propName + ']'),
        tagName = ''

      for (var i = 0, ii = elements.length; i < ii; i++) {
        tagName = elements[i].tagName.toLowerCase()

        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
          elements[i].value = newVal
        } else {
          elements[i].innerHTML = newVal
        }

      }
    })
    return pubSub
  }

  /**
   * 数据模型 modal
   * @example <input type="text" data-bind-uuid="name"> <p data-bind-uuid="name"></p>
   * @param uuid
   * @returns {{attributes: {}, set: set, get: get, off: off, _binder: DataBinder}}
   * @constructor
   */
  function User(uuid) {
    var binder = new DataBinder(uuid),

      user = {
        attributes: {},

        set: function (attrName, val, isView) {
          this.attributes[attrName] = val
          /**
           * 避免过多次更新视图
           */
          if (!isView) {
            binder.publish(uuid + ':change', attrName, val, this)
          }
        },

        get: function (attrName) {
          return this.attributes[attrName]
        },
        /**
         * 写了取消双向邦定，没什么卵用
         * @param eventName
         */
        off: function (eventName) {
          binder.off(eventName)
        },

        _binder: binder
      }

    binder.on(uuid + ':change', function (e, attrName, newVal, initiator) {
      if (initiator !== user) {
        user.set(attrName, newVal, true)
      }
    })

    return user
  }

}(this)
