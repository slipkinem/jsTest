/**
 * Created by slipkinem on 2016/8/29.
 */
var http = require('http');
var querystring = require('querystring');

var postData = querystring.stringify({
    'content':'老师带我飞！',
    'mid':8837
});

var options = {
    hostname:'www.imooc.com',
    port:80,
    path:'/course/docomment',
    method:'POST',
    headers:{
         'Accept':'application/json, text/javascript, */*; q=0.01',
         'Accept-Encoding':'gzip, deflate',
         'Accept-Language':'zh-CN,zh;q=0.8',
         'Connection':'keep-alive',
         'Content-Length':postData.length,
         'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
         'Cookie':'imooc_uuid=2555bad9-a7db-45f9-9d55-c9abea9c853d; imooc_isnew_ct=1472182610; loginstate=1; apsid=M3ZTliYmE3NWUyMzExYThmZjYyZmY2Mjc1NjNkYWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjkyNDQwMwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzOTg4NzM5MDFAcXEuY29tAAAAAAAAAAAAAAAAAAAAADJjZGU5OTlmMWY5MzQzNmU2ZDFlNzEwMTk1MjY5NTgwXLm%2FV1y5v1c%3DYm; last_login_username=398873901%40qq.com; PHPSESSID=8rqbl9bp7s65di90hpcppfk5u0; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1472452710; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1472452851; imooc_isnew=2; cvde=57c3d85ff3d29-8',
         'Host':'www.imooc.com',
         'Origin':'http://www.imooc.com',
         'Referer':'http://www.imooc.com/video/8837',
         'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2767.5 Safari/537.36',
         'X-Requested-With':'XMLHttpRequest'
    }
};

var req = http.request(options , function (res) {
    console.log('status：'+res.statusCode);
    console.log('headers：'+JSON.stringify(res.headers));
    console.log('data：'+postData.length);

    res.on('data',function (data) {
        console.log(Buffer.isBuffer(data));
        console.log(typeof data);
    });

    res.on('end',function () {
        console.log('end')
    });
    res.on('error',function (err) {
        console.log(err.message);
    });
});
req.write(postData);
req.end();