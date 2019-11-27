'use strict';

let dns = require('native-dns');
let server = dns.createServer();
var path = require('path');
var fs = require('fs');

server.on('listening', () => {
  console.log('server listening on', server.address());
});
server.on('close', () => {
  console.log('server closed', server.address());
});
server.on('error', (err, buff, req, res) => {
  console.error(err.stack);
});
server.on('socketError', (err, socket) => {
  console.error(err);
});

server.serve(53);

let settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json')));
async function proxy(question, response, cb) {
  console.log('proxying', question.name);

  for(var i in settings.servers) {
    var server = settings.servers[i];
    let isSucces = await sendRequest(server, question, response);
    if(isSucces){
      break;
    }else{
      console.error(`Error dns resolver (name: ${question.name}, server: ${server.address})`);
    }
  }
  cb();
}

function sendRequest(server, question, response) {
  return new Promise(resolve => {
    let request = dns.Request({
      question: question, // forwarding the question
      server: server,  // this is the DNS server we are asking
      timeout: 1000
    });
    
    // when we get answers, append them to the response
    request.on('message', (err, msg) => {
      msg.answer.forEach(a => response.answer.push(a));
    });

    request.on('end', function () {
      let isSuccess = response.answer.length > 0;
      resolve(isSuccess);
    });
    request.send();
  });
}

let async = require('async');
function handleRequest(request, response) {
  console.log('request from', request.address.address, 'for', request.question[0].name);

  let f = []; // array of functions

  // proxy all questions
  // since proxying is asynchronous, store all callbacks
  request.question.forEach(question => {
    f.push(cb => proxy(question, response, cb));
  });

  // do the proxying in parallel
  // when done, respond to the request by sending the response
  async.parallel(f, function () { response.send(); });
}

server.on('request', handleRequest);