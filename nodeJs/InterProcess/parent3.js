var cp = require('child_process')

// fork一个子进程
var child1 = cp.fork('child3.js')
var child2 = cp.fork('child3.js')

// 创建一个TCP服务器
var server = require('net').createServer()

// 监听1337端口，并执行成功后的回调
server.listen(1337, function () {
	// 发送数据， srever是句柄
	child1.send('server', server)
	child2.send('server', server)
	server.close()
})

