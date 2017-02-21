/**
 * Created by slipkinem on 2016/8/30.
 */
var fs = require('fs');

fs.readFile('no-data.png',function (err,origin_buffer) {
    console.log(Buffer.isBuffer(origin_buffer))
    console.log(origin_buffer)
    fs.writeFile('logo_buffer.png',origin_buffer,function (err) {
       if(err){
           console.log(err)
       }
    });

    // var base64_img = new Buffer(origin_buffer).toString('base64');
    var base64_img = origin_buffer.toString('base64');

    var decodeImage = new Buffer(base64_img,'base64');
    
    console.log(base64_img);
    console.log(decodeImage);
    console.log(Buffer.compare(origin_buffer,decodeImage));
    
    fs.writeFile('decodeImage.png',decodeImage,function (err) {
        if(err){
            console.log(err);
        }
    })
});