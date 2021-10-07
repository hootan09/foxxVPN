var express = require('express')
var app = express()
var https = require('https');
var http = require('http');

const { internalError, logRequest } = require('./utils/utils');
 
const PORT = process.env.PORT || 3000;

app.use('/testrequest', async (req,res, next)=>{

    try {
        res.status(200).send(logRequest(req));
    } catch (error) {
        internalError(res, error);
    }
})


app.use('/', function(req, res) {
  try {
    const requestData = logRequest(req);
    if(requestData.originalUrl == '/'){
      return res.status(200).json({
        uptime: process.uptime(),
        title: process.title,
        version: process.version,
      })
    }
    if (requestData.protocol == "https") {
        requestData.parsedPort = 443
        requestData.parsedSSL = https
    } else if (requestData.protocol == "http") {
      requestData.parsedPort = 80
      requestData.parsedSSL = http
    }
    const options = { 
      hostname: requestData.hostname,
      port: requestData.parsedPort,
      path: req.path,
      method: requestData.method,
      headers: requestData.headers
    };
      
    const serverRequest = requestData.parsedSSL.request(options, (serverResponse) => { 
      serverResponse.pipe(res, { end: true }); 
      // var body = '';
      // if (String(serverResponse.headers['content-type']).indexOf('text/html') !== -1) {
      //   serverResponse.on('data', function(chunk) {
      //     body += chunk;
      //   }); 
  
      //   serverResponse.on('end', function() {
      //     // Make changes to HTML files when they're done being read.
      //     body = body.replace(`example`, `Cat!` );
  
      //     res.writeHead(serverResponse.statusCode, serverResponse.headers);
      //     res.end(body);
      //   }); 
      // }   
      // else {
      //   serverResponse.pipe(res, {
      //     end: true
      //   }); 
      //   res.contentType(serverResponse.headers['content-type'])
      // }   
    }); 
  
    serverRequest.end();

  } catch (error) {
    internalError(res, error);
  }
  });

  app.listen(3000, console.log(`Running on 0.0.0.0:${PORT}`));