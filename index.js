'use strict'

class GitGraph {
  constructor (options) {
    this.options = options || {}
  }

  request (options) {
    var Request = require('./lib/request')
    options = options || {}
    options.headers = Object.assign(Object.assign({}, this.options.headers), options.headers)
    options = Object.assign({}, this.options, options)
    let request = new Request(options)
    return request.request()
  }
}