/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-08-30 19:22:41
 * @version $Id$
 */
// { [Function: ReadStream]
//   super_: 
//    { [Function: Readable]
//      ReadableState: [Function: ReadableState],
//      super_: 
//       { [Function: Stream]
//         super_: [Object],
//         Readable: [Circular],
//         Writable: [Object],
//         Duplex: [Object],
//         Transform: [Object],
//         PassThrough: [Object],
//         Stream: [Circular] },
//      _fromList: [Function: fromList] } }


// { [Function: Readable]
//   ReadableState: [Function: ReadableState],
//   super_: 
//    { [Function: Stream]
//      super_: 
//       { [Function: EventEmitter]
//         EventEmitter: [Circular],
//         usingDomains: false,
//         defaultMaxListeners: [Getter/Setter],
//         init: [Function],
//         listenerCount: [Function] },
//      Readable: [Circular],
//      Writable: { [Function: Writable] WritableState: [Function: WritableState], super_: [Circular] },
//      Duplex: { [Function: Duplex] super_: [Circular] },
//      Transform: { [Function: Transform] super_: [Object] },
//      PassThrough: { [Function: PassThrough] super_: [Object] },
//      Stream: [Circular] },
//   _fromList: [Function: fromList] }
// var util = require('util');

// function Base() {
//     this.name = 'base';
//     this.base = 1991;
//     this.sayHello = function() {
//         console.log('Hello ' + this.name);
//     };
// }
// Base.prototype.showName = function() {
//     console.log(this.name);
// };
// function Sub() {
//     this.name = 'sub';
// }
// util.inherits(Sub, Base);

// var objBase = new Base();

// objBase.showName();  //base
// objBase.sayHello(); //base
// console.log(objBase);
// var objSub = new Sub();
// objSub.showName(); //sub
// //objSub.sayHello();
// console.log(objSub);

function Lvsen(){
	this.name = 'lvsen';
	this.age = '20';
	this.sayHello = function (){
		console.log(this.name);
	}
}

Lvsen.prototype.showName = function () {
	console.log(this.name);
}

function Lala(){
	this.name = 'asdf';
}

Lala.prototype = new Lvsen();

var lvsen = new Lvsen();
var lala = new Lala();
lvsen.sayHello();
lala.sayHello();
lvsen.showName();
lala.showName();