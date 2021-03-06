var http = require('http'),
  net = require('net'),
  httpProxy = require('http-proxy'),
  url = require('url'),
  util = require('util');

var proxy = httpProxy.createServer();

var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var getHostPortFromString = function (hostString, defaultPort) {
  var host = hostString;
  var port = defaultPort;

  var result = regex_hostport.exec(hostString);
  if (result != null) {
    host = result[1];
    if (result[2] != null) {
      port = result[3];
    }
  }

  return ( [host, port] );
};
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var server = http.createServer(function (req, res) {
  console.log('Receiving reverse proxy request for:' + req.url);
  console.log(req)
  console.log("----------------------")
  var parsedUrl = url.parse(req.url);
  var target = parsedUrl.protocol + '//' + parsedUrl.hostname;
  var data = '';
	/*
  if(req.url.match(/www.dmm.com/) && req.url.match(/app/) && req.url.match(/854854/) ){ //&& req.url.match(/httpstohttp/)){
    res.writeHead(301, {
    'Location': 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/'
    });
    res.end();
    console.log("redirected");
    return;
  }
  */
  proxy.web(req, res, { target: target, secure: false, enable: { xforward: true } ,toProxy: true} , function(e) { console.log(e) });
}).listen(process.env.PORT || 7778);

/*
server.on('connect', function (req, socket) {
  //console.log('Receiving reverse proxy request for:' + req.url);

  
});
*/

server.on('connect', function (req, socket, bodyhead) {
	/*
  var hostPort = getHostPortFromString(req.url, 443);
  var hostDomain = hostPort[0];
  var port = parseInt(hostPort[1]);
  console.log("Proxying HTTPS request for:", hostDomain, port);	
/*
  if(req.url.match(/www.dmm.com/) ){//&& req.url.match(/app/) && req.url.match(/854854/) ){ //&& req.url.match(/httpstohttp/)){
    socket.write("HTTP/1.1 301 Moved Permanently\r\nLocation: http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/\r\n");
    socket.end();
    console.log("redirected");
    return;
  }
  */
  var serverUrl = url.parse('http://' + req.url);

  var srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function () {
    socket.write('HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-agent: Node-Proxy\r\n' +
      '\r\n');
    srvSocket.pipe(socket);
    socket.pipe(srvSocket);
  });
});

proxy.on('proxyReq', (proxyReq, req, res, options) => { 
	console.log('Receiving reverse proxy request for:' + req.url);
	return;
	if(!req.url.match(/https/) || !req.url.match(/www.dmm.com/) || !req.url.match(/app/) || !req.url.match(/854854/)) return;
        console.log("redirected!")
        res.redirect(301, "http:" + req.url);
});

