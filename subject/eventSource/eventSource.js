/**
 * Created by sen.lv on 2021/6/24 at 15:22.
 */
const http = require('http');


http.createServer((req, res) => {
  // res.writeHead('Access-Control-Allow-Origin', '*');  // 允许所有路径跨域
  // res.writeHead('Access-Control-Allow-Headers', 'X-Requested-With');
  // res.writeHead('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // res.writeHead('X-Powered-By', ' 3.2.1');
  res.writeHead(200, {
    'Transfer-Encoding': 'chunked',
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
  });
  setInterval(() => {
    res.write('data: {"message":"' + new Date().getTime() + '"}\n\n');
  }, 10000);
}).listen(8877);
