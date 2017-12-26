/******/(function(modules) {
/******/	let installedModules = {};
/******/	function require(moduleId) {
/******/		if(installedModules[moduleId])
/******/			return installedModules[moduleId].exports;
/******/		let module = installedModules[moduleId] = {
/******/			exports: {}
/******/		};
/******/		modules[moduleId](module, module.exports, require);
/******/		return module.exports;
/******/	}
/******/	return require(0);
/******/})/******/({
/******/0: function(module, exports, require){ 

/**
 * Created by slipkinem on 12/25/2017 at 5:23 PM.
 */
const a = require(/* ./a */1)
const b = require(/* ./b */2)

function fuck () {
  a()
  b()
}


/******/}, 
/******/
/******/1: function(module, exports, require){ 

/**
 * Created by slipkinem on 12/25/2017 at 5:23 PM.
 */
module.exports = function shit () {
  console.log('shit')
}

/******/}, 
/******/
/******/2: function(module, exports, require){ 

/**
 * Created by slipkinem on 12/25/2017 at 5:24 PM.
 */
module.exports = function fuck () {
  console.log('fuck')
}


/******/}, 
/******/
/******/});