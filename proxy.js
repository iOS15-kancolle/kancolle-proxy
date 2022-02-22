var http = require('http'),
  net = require('net'),
  httpProxy = require('http-proxy'),
  url = require('url'),
  util = require('util');

var proxy = httpProxy.createServer();

var server = http.createServer(function (req, res) {
  console.log('Receiving reverse proxy request for:' + req.url);
  var parsedUrl = url.parse(req.url);
  var target = parsedUrl.protocol + '//' + parsedUrl.hostname;
  var data = '';
  proxy.web(req, res, { target: target, secure: false });
}).listen(process.env.PORT || 8000);

server.on('connect', function (req, socket) {
  console.log('Receiving reverse proxy request for:' + req.url);

  var serverUrl = url.parse('http://' + req.url);

  var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function () {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-agent: Node-Proxy\r\n' +
      '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});

proxy.on('proxyRes', (proxyRes, req, res, options) => { 
	console.log('Receiving reverse proxy response for:' + req.url);
	if(!req.url.match(/https:/) || !req.url.match(/app_id=854854/)) return;
	res.redirect(301, "http" + req.url.split(":")[1]);
});
