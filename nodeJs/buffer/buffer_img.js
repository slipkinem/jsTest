/**
 * Buffer是一个全局对象，有点类似数组，可以存储字符串，二进制流，base64等等
 * Buffer由nodeJS的c++模块单独编写，不依赖v8来进行内存的分配,所以要小心内存泄露
 * 内存分配基于slab，slab就是一块申请好的固定内存，内存通过8KB（既8*1024 bytes）来判断是否是大对象
 * new Buffer 就相当于分配一个slab单元，实例对象指向slab单元的地址
 * 针对小对象 当再次创建buffer实例的话，看slab内存够不够，不够的话就新开辟一块slab空间，slab是可以共享的
 * 针对大对象 会直接分配一个SlowBuffer对象作为slab单元，内存为单独使用，不进行共享
 *
 * 关于字节编码
 *  西文（英语）为一般字节编码，直接使用toString （默认以utf-8编码）方法不会报错
 *  宽字节编码（中文），中文在utf8占3个字节，在调用的时候有几率被截断，导致乱码，避免乱码应该将字符串拼接为一个整体再使用**Buffer.concat()**
 *
 * Created by slipkinem on 2016/8/30.
 */
var fs = require('fs');

fs.readFile('no-data.png', function (err, origin_buffer) {
  console.log(Buffer.isBuffer(origin_buffer))
  console.log(origin_buffer)
  fs.writeFile('logo_buffer.png', origin_buffer, function (err) {
    if (err) {
      console.log(err)
    }
  });

  // var base64_img = new Buffer(origin_buffer).toString('base64');
  var base64_img = origin_buffer.toString('base64');

  var decodeImage = new Buffer(base64_img, 'base64');

  console.log(base64_img);
  console.log(decodeImage);
  console.log('base64_img compare decodeImage ', Buffer.compare(origin_buffer, decodeImage));

  fs.writeFile('decodeImage.png', decodeImage, function (err) {
    if (err) {
      console.log(err);
    }
  })
});