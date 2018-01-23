/**
 * Created by slipkinem on 1/22/2018 at 2:46 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
window.onload = main;
// window.validate = {}
var assert = function (condition, message) {
    if (!condition) {
        console.error('[data-validator]' + message);
    }
};
var $ = function (el) { return document.querySelector(el); };
var addClass = function (el, className) {
    if (el.className.indexOf(className) === -1) {
        el.className = el.className + ' ' + className;
    }
};
var removeClass = function (el, className) {
    if (el.className.indexOf(className) === -1)
        return;
    var cls = el.className.split(' ');
    cls.splice(cls.indexOf(className), 1);
    el.className = cls.join(' ');
};
function main() {
    var lsData = {
        username: '',
        password: '',
        rePassword: '',
        email: '',
        tel: ''
    };
    var rules = {
        username: {
            required: true
        }
    };
    var $validate = document.querySelectorAll('[data-validate]')[0];
    var $validateItems = $validate.querySelectorAll('[data-prop]');
    [].map.call($validateItems, function (item) {
        var prop = item.getAttribute('data-prop');
        var $input = item.getElementsByTagName('input')[0];
        var $content = item.getElementsByClassName('ls-form-item__content')[0];
        $input.addEventListener('blur', function () {
            var $message = document.createElement('div');
            $message.className = 'ls-form-item__message';
            if (rules[prop] && rules[prop].required) {
                if ($input.value === '') {
                    $message.innerText = rules[prop].message || prop + " is required";
                    $content.appendChild($message);
                    item.className = item.className + ' ' + 'error';
                }
                else {
                    $content.lastChild.style.display = 'none';
                    removeClass(item, 'error');
                    addClass(item, 'success');
                }
            }
        });
    });
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
