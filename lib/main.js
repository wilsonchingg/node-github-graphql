'use strict'

const request = require('request')
const winston = require('winston')
const HttpsProxyAgent = require('https-proxy-agent')

var Promise = require('bluebird')

const util = require('./util')

/*
 * Object capable of making API calls.
 */
class GithubGraphQLApi {
  constructor (options) {
    options = options || {}
    this.options = options
    this.userAgent = options.userAgent
    this.url = options.url || 'https://api.github.com/graphql'
    this.debug = options.debug
    this.Promise = options.Promise || options.promise || Promise
    this.token = this.options.token
    if (!this.userAgent) {
      var pjson = require('../package.json')
      this.userAgent = 'github-graphql/' + pjson.version
    }
    if (this.debug) {
      winston.level = 'debug'
    }

    if (process.env.HTTP_PROXY && this.options.proxy !== null) {
      this.agent = new HttpsProxyAgent(process.env.HTTP_PROXY)
    } else if (this.options.proxy) {
      this.agent = new HttpsProxyAgent(this.options.proxy)
    }
  }

  logger (msg, level) {
    if (this.debug || level === 'error') {
      winston.log(level || 'debug', msg)
    }
  }

  /*
   * Perform the actual API request.
   */
  query (payload, variables, callback) {
    const opts = {}
    const _self = this

    opts.url = _self.url
    var headers = Object.assign({
      'Content-type': 'application/json',
      'Authorization': 'bearer ' + _self.token,
      'User-Agent': _self.userAgent
    }, _self.options.headers)
    opts.headers = headers
    var body = {}
    body.query = payload.replace(/\n/g, '')
    if (variables) {
      body.variables = JSON.stringify(variables)
    }
    opts.body = JSON.stringify(body)
    // remove null|undefined headers
    for (var k in Object.keys(headers)) {
      if (headers[k] === null || headers[k] === undefined) {
        delete headers[k]
      }
    }
    _self.logger('Ready to send request')
    _self.logger(opts)
    if (callback) {
      request.post(opts, (error, response, body) => {
        var parsed
        var message
        if (body && util.isStringJSON(body)) {
          parsed = JSON.parse(body)
          message = parsed.message || parsed.errors
        }
        _self.logger('Returning graphql response from callback')
        callback(message ? undefined : parsed, error || message)
      })
    } else {
      return new _self.Promise(function (resolve, reject) {
        request.post(opts, (error, response, body) => {
          var parsed
          var message
          if (body && util.isStringJSON(body)) {
            parsed = JSON.parse(body)
            message = parsed.message || parsed.errors
          }
          if (!message) {
            _self.logger('Resolving graphql reponse')
            resolve(parsed)
          } else {
            _self.logger('Unexpected error sending graphql request to server', 'error')
            _self.logger(error || message, 'error')
            reject(error || message)
          }
        })
      })
    }
  }
}

module.exports = GithubGraphQLApi
