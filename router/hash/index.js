/**
 * Created by slipkinem on 2/8/2018 at 11:22 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
function noop() {
}
var Router = /** @class */ (function () {
    function Router() {
        this.routes = {};
        this.currentUrl = '';
    }
    Router.prototype.route = function (path, callback) {
        if (callback === void 0) { callback = noop; }
        this.routes[path] = callback;
    };
    Router.prototype.refresh = function () {
        console.log('触发一次 hashchange, hash = ', location.hash);
        this.currentUrl = location.hash.slice(1) || '/';
        this.routes[this.currentUrl]();
    };
    Router.prototype.init = function () {
        window.addEventListener('load', this.refresh.bind(this), false);
        window.addEventListener('hashchange', this.refresh.bind(this), false);
    };
    return Router;
}());
window.onload = main;
function main() {
    var router = new Router();
    router.init();
    var content = document.querySelector('body');
    function changeColor(color) {
        content.style.backgroundColor = color;
    }
    router.route('/', function () {
        changeColor('white');
    });
    router.route('/blue', function () {
        changeColor('blue');
    });
    router.route('/green', function () {
        changeColor('green');
    });
}
