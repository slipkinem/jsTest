/**
 * Created by slipkinem on 1/22/2018 at 2:46 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
window.onload = main
// window.validate = {}
const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error('[data-validator]' + message)
  }
}

const $ = (el: string) => document.querySelector(el)

const addClass = (el: Element, className: string) => {
  if (el.className.indexOf(className) === -1) {
    el.className = el.className + ' ' + className
  }
}

const removeClass = (el: Element, className: string) => {
  if (el.className.indexOf(className) === -1) return
  let cls = el.className.split(' ')
  cls.splice(cls.indexOf(className), 1)
  el.className = cls.join(' ')
}

function main () {
  let lsData = {
    username: '',
    password: '',
    rePassword: '',
    email: '',
    tel: ''
  }

  let rules = {
    username: {
      required: true
    }
  }

  let $validate = document.querySelectorAll('[data-validate]')[0]
  let $validateItems = $validate.querySelectorAll('[data-prop]')

  ;[].map.call($validateItems, (item) => {
    let prop = item.getAttribute('data-prop')
    let $input: HTMLInputElement = item.getElementsByTagName('input')[0]
    let $content = item.getElementsByClassName('ls-form-item__content')[0]

    $input.addEventListener('blur', () => {
      let $message = document.createElement('div')
      $message.className = 'ls-form-item__message'

      if (rules[prop] && rules[prop].required) {
        if ($input.value === '') {
          $message.innerText = rules[prop].message || `${prop} is required`
          $content.appendChild($message)
          item.className = item.className + ' ' + 'error'
        } else {
          $content.lastChild.style.display = 'none'
          removeClass(item, 'error')
          addClass(item, 'success')
        }
      }
    })
  })

}

// class validator {
//   data: any
//   rules: object[]
//
//   constructor (data: any) {
//     this.data = data
//     this.setValidate()
//   }
//
//   setValidate () {
//
//   }
//
//
// }