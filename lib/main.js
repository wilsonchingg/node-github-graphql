'use strict'

const request = require('request');
const HttpsProxyAgent = require('https-proxy-agent');

var Promise = require("./promise");

/*
 * Object capable of making API calls.
 */
class GithubGraphQLApi {
  constructor (options) {
    options = options || {}
    this.options = options
    this.userAgent = options.userAgent
    this.url = options.url || 'https://api.github.com/graphql'
    this.debug = options.debug;
    this.Promise = options.Promise || options.promise || Promise;
    // TODO oauth
    this.token = this.options.token
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
  query (payload, callback) {
    const opts = {}
    opts.url = this.url
    var headers = Object.assign({
      'Content-type': 'application/json',
      'Authorization': 'bearer ' + this.token,
      'User-Agent': this.userAgent
    }, this.options.headers)
    opts.headers = headers
    var body = {}
    body.query = 'query{' + payload.replace(/\n/g, '') + '}'
    opts.body = JSON.stringify(body)
    // remove null|undefined headers
    for (var k in Object.keys(headers)) {
      if (headers[k] === null || headers[k] === undefined) {
        delete headers[k]
      }
    }
    if(this.debug) {
      console.log('Ready to send request');
      console.log(opts);
    }
    if(callback) {
      request.post(opts, (error, response, body) => {
        callback(response, error)
      })
    }
    else{
      return new this.Promise(function(resolve) {
        request.post(opts, (error, response, body) => {
            var parsed = undefined
            var message = undefined
            if(body) {
              parsed = JSON.parse(body)
              message = parsed.message
            }
            resolve(message ? undefined: parsed, error  || message);
        })
      })
    }
  }

}


module.exports = GithubGraphQLApi