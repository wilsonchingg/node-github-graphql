'use strict'

const ava = require('ava')
const test = ava.test
const GithubGraphQLApi = require('.')
const nock = require('nock')

const apiQuery = `
  viewer {
    login
  }`

const apiResponse = {
  'data': {
    'viewer': {
      'login': 'wilsonchingg'
    }
  }
}

test.before(() => {
  nock.disableNetConnect()
})

test('post /apps without params', t => {
  let github = new GithubGraphQLApi()
  let api = nock('https://api.github.com')
  .post('/graphql')
  .reply(201, apiResponse)

  return github.query(apiQuery).then(() => {
    t.pass()
    api.done()
  })
})

test('post /apps with params', t => {
  let github = new GithubGraphQLApi({
    userAgent: 'Test',
    proxy: 'http://proxy.test.com'
  })
  let api = nock('https://api.github.com')
  .post('/graphql')
  .reply(201, apiResponse)
  t.pass()
  github.query(apiQuery, null, () => {
    t.pass()
    api.done()
  })
})
