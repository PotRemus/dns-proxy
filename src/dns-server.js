'use strict';

const dns = require('native-dns');
const path = require('path');
const fs = require('fs');
const async = require('async');
const logger = require('./logger');

class DsnServer {
  constructor(servers) {
    this._favoriteDns = {};
    this._servers = servers;
    this._server = dns.createServer();
    this._server.on('listening', () => {
      console.log('server listening on', this._server.address());
    });
    this._server.on('close', () => {
      logger.log('server closed', this._server.address());
    });
    this._server.on('error', (err, buff, req, res) => {
      logger.error(err.stack);
    });
    this._server.on('socketError', (err, socket) => {
      logger.error(err);
    });
    this._server.on('request', (req, res) => {
      return this._handleRequest(req, res);
    });
  }

  start() {
    this._server.serve(53);
  }

  _handleRequest(request, response) {
    console.log('request from', request.address.address, 'for', request.question[0].name);

    let f = []; // array of functions
    // proxy all questions
    // since proxying is asynchronous, store all callbacks
    request.question.forEach(question => {
      f.push(cb => {
        return this._proxy(question, response, cb)
      });
    });
    // do the proxying in parallel
    // when done, respond to the request by sending the response
    async.parallel(f, function () { response.send(); });
  }

  async _proxy(question, response, cb) {
    console.log('proxying', question.name);

    let isSucces = false;
    if (this._favoriteDns[question.name]) {
      let favoriteDns = this._favoriteDns[question.name];
      if (favoriteDns && favoriteDns.expire > new Date()) {
        let dsnServer = this._servers.find(server => {
          return server.address === favoriteDns.address
        });
        if (dsnServer) {
          isSucces = await this._sendRequest(dsnServer, question, response);
        }
      }
    }

    if (!isSucces) {
      for (let i in this._servers) {
        let dsnServer = this._servers[i];
        isSucces = await this._sendRequest(dsnServer, question, response);
        if (isSucces) {
          this._favoriteDns[question.name] = {
            expire: this._addDays(new Date(), 1),
            address: dsnServer.address
          }
          break;
        } else {
          console.error(`Error dns resolver (name: ${question.name}, server: ${dsnServer.address})`);
        }
      }
    }
    cb();
  }

  _addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  _sendRequest(server, question, response) {
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
}

let settings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'settings.json')));
let dsnServer = new DsnServer(settings.servers);
dsnServer.start();