var stream = require('stream'); //依赖stream流
var util = require('util'); //依赖工具函数

function ReadStream () {
  stream.Readable.call(this);  //声明 ReadStream,等于给this了stream.Readable方法
}

util.inherits(ReadStream, stream.Readable);  //继承stream.Readable.protoype的方法；

// console.log(ReadStream);
// console.log(stream.Readable);

ReadStream.prototype._read = function () {  //创建原型方法
  this.push('I');
  this.push('Love');
  this.push('LvSen\n');
  this.push(null);
}

function WriteStream () {
  stream.Writable.call(this);  //对象冒充，得到  stream.Writable的方法
  this._cached = new Buffer(''); //得到一个方法
}

util.inherits(WriteStream, stream.Writable);  //继承原型方法

WriteStream.prototype._write = function (chunk, encode, callback) {
  console.log(chunk.toString());
  callback();
};

function TransformStream () {
  stream.Transform.call(this);
}

util.inherits(TransformStream, stream.Transform);

TransformStream.prototype._transform = function (chunk, encode, callback) {
  this.push(chunk);
  callback();
}

TransformStream.prototype._flush = function (callback) {
  this.push('oh Yeah!');
  callback();
}

var rs = new ReadStream();
var ws = new WriteStream();
var ts = new TransformStream();

rs.pipe(ts).pipe(ws);
