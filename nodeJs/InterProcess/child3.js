var http = require('http')

// 创建一个HTTP服务
var server = http.createServer(function (req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	})
	res.end('handled by child, pid is ' + process.pid + '\n')
})

// 接受parent发送过来的参数
process.on('message', function (m, tcp) {
	if (m === 'server') {
		tcp.on('connection', function (socket) {
			server.emit('connection', socket)
		})
	}
})