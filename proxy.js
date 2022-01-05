var http = require('http'),
    net = require('net'),
    httpProxy = require('http-proxy'),
    url = require('url'),
    util = require('util');

var proxy = httpProxy.createServer();

var server = http.createServer(function (req, res) {
  util.puts('Receiving reverse proxy request for:' + req.url);
  var parsedUrl = url.parse(req.url);
  var target = parsedUrl.protocol + '//' + parsedUrl.hostname;
  proxy.web(req, res, {target: target, secure: false});
}).listen(8000);

server.on('connect', function (req, socket) {
  util.puts('Receiving reverse proxy request for:' + req.url);

  var serverUrl = url.parse('https://' + req.url);

  var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function() {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
    'Proxy-agent: Node-Proxy\r\n' +
    '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});

proxy.on('proxyRes', (proxyRes: IncomingMessage): void => {
    switch(proxyRes.url){
        case "":
        
        break;
        
        case "":
        
        break;
        
        case "":
        
        break;       
    }
})

function dataSend(data){
  
}
