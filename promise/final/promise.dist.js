(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Promise", [], factory);
	else if(typeof exports === 'object')
		exports["Promise"] = factory();
	else
		root["Promise"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by slipkinem on 2017/3/27.
 */

/**
 * 工具类
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = function () {
  function util() {
    _classCallCheck(this, util);
  }

  _createClass(util, null, [{
    key: 'isFunction',
    value: function isFunction(value) {
      return typeof value === 'function';
    }
  }, {
    key: 'isArray',
    value: function isArray(value) {
      return Array.isArray(value);
    }
  }]);

  return util;
}();

/**
 * Promise
 * @constructor
 */


var Promise = function (_util) {
  _inherits(Promise, _util);

  function Promise(executor) {
    _classCallCheck(this, Promise);

    var _this2 = _possibleConstructorReturn(this, (Promise.__proto__ || Object.getPrototypeOf(Promise)).call(this, executor));

    if (!Promise.isFunction(executor)) throw new TypeError('参数必须是一个函数');
    _this2._status = 'PENDING';
    _this2._value = Object.create(null);
    _this2._reason = Object.create(null);
    _this2._rejecteds = [];
    _this2._deferreds = [];
    var _this = _this2;

    function resolve(value) {
      setTimeout(function () {
        try {
          if (_this._status === 'PENDING') {
            _this._status = 'RESOLVED';
            _this._value = value;

            _this._deferreds.forEach(function (deferred) {
              deferred(value);
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    }

    function reject(reason) {
      setTimeout(function () {
        try {
          if (_this._status === 'PENDING') {
            _this._status = 'REJECTED';
            _this._reason = reason;

            _this._rejecteds.forEach(function (rejected) {
              rejected(reason);
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    }

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }

    return _this2;
  }

  _createClass(Promise, [{
    key: 'catch',
    value: function _catch(onRejected) {
      this.then(null, onRejected);
    }
  }, {
    key: 'then',
    value: function then(onFulfilled, onRejected) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var returnedValue = Object.create(null);
        /**
         * 如果是RESOLVED状态说明执行了过resolve函数，this.value是有值的
         * e.g. Promise.resolve('resolve').then(function(result){})
         * 最主要看onFulfilled返回值是什么
         */
        /**
         * _RESOLVED
         * @param value
         * @private
         */
        function _RESOLVED(value) {
          returnedValue = Promise.isFunction(onFulfilled) && onFulfilled(value) || value;

          try {
            if (returnedValue && returnedValue instanceof Promise) {
              returnedValue.then(function (value) {
                resolve(value);
              }, function (reason) {
                reject(reason);
              });
            } else {
              resolve(returnedValue);
            }
          } catch (e) {
            reject(e);
          }
        }

        /**
         * 失败的错误
         * @param reason
         * @private
         */
        function _REJECTED(reason) {
          returnedValue = Promise.isFunction(onRejected) && onRejected(reason) || reason;

          reject(returnedValue);
        }

        if (_this3._status === 'RESOLVED') {
          _RESOLVED(_this3._value);
        } else if (_this3._status === 'REJECTED') {
          _REJECTED(_this3._reason);
        } else if (_this3._status === 'PENDING') {
          /**
           * e.g. new Promise().then(function(result){})
           */
          _this3._deferreds.push(_RESOLVED);

          _this3._rejecteds.push(_REJECTED);
        }
      });
    }
  }], [{
    key: 'resolve',
    value: function resolve(value) {
      return new Promise(function (resolve, reject) {
        resolve(value);
      });
    }
  }, {
    key: 'all',
    value: function all(promises) {
      if (!Promise.isArray(promises)) throw new TypeError('promises 必须是一个数组');

      return new Promise(function (resolve, reject) {
        var result = [],
            len = promises.length;

        function resolveAll(value) {
          result.push(value);

          if (--len === 0) {
            resolve(result);
          }
        }

        promises.forEach(function (promise) {
          /**
           * 将成功后的加入result数组
           * 一旦有一个失败，则直接返回失败
           */
          promise.then(resolveAll, reject);
        });
      });
    }
  }]);

  return Promise;
}(util);

module.exports = Promise;

/***/ })
/******/ ]);
});