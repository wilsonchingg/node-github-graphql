'use strict'

const request = require('request');
const HttpsProxyAgent = require('https-proxy-agent');

var Promise = require("./promise");

/*
 * Object capable of making API calls.
 */
class Request {
  constructor (options) {
    options = options || {}
    this.options = options
    this.userAgent = options.userAgent
    this.url = options.url || 'https://api.github.com/graphql'
    this.debug = Util.isTrue(options.debug);
    this.Promise = options.Promise || options.promise || Promise;
    // TODO oauth
    this.tokens = this.options.token
    if (!this.userAgent) {
      var pjson = require('../package.json')
      this.userAgent = 'github-graphql/' + pjson.version
    }

    if (process.env.HTTP_PROXY && this.options.proxy !== null) {
      this.agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
    }
    else if(this.options.proxy) {
      this.agent = new HttpsProxyAgent(this.options.proxy);
    }
      
  }

  /*
   * Perform the actual API request.
   */
  request (payload, callback) {
    const opts = {}
    opts.url = this.url
    var headers = Object.assign({
      'Content-type': 'application/json',
      'Authorization': 'bearer ' + this.token,
      'User-Agent': this.userAgent
    }, this.options.headers)
    opts.headers = headers
    var body = {}
    body.query = payload.replace(/\n/g, '')
    opts.body = body

    // remove null|undefined headers
    for (var k in Object.keys(headers)) {
      if (headers[k] === null || headers[k] === undefined) {
        delete headers[k]
      }
    }
    if(callback) {
      request.post(opts, (error, response, body) => {
        callback(response, error)
      })
    }
    else{
      return new this.Promise(function(resolve,reject) {
        request.post(opts, (error, response, body) => {
          if (error) {
            reject(err);
          }
          else{
            resolve(obj);
          }
        })
      })
    }
  }

}


module.exports = Request