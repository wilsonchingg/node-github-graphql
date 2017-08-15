## Node-Github-GraphQL

A GitHub GraphQL HTTP wrapper

### Table of contents

- [Node-Github-GraphQL](#node-github-graphql)
  * [Table of contents](#table-of-contents)
  * [Installation](#installation)
  * [Basic Example](#basic-example)
  * [Advanced Example](#advanced-example)
  * [API Reference](#api-reference)
  * [LICENSE](#license)

### Installation

```
npm install node-github-graphql --save
```

### Basic Example

```javascript
var GithubGraphQLApi = require('node-github-graphql')
var github = new GithubGraphQLApi({
  token: process.env.GITHUB_API_TOKEN
})
github.query(`
{
	viewer {
	  login
	}
}
`, null, (res, err) => {
  console.log(JSON.stringify(res, null, 2))
})
```

### Advanced Example

```javascript
var GithubGraphQLApi = require('node-github-graphql')
var github = new GithubGraphQLApi({
  Promise: require('bluebird'),
  token: process.env.GITHUB_API_TOKEN,
  userAgent: 'Hello', // Optional, if not specified, a default user agent will be used
  debug: true
})
github.query(`
query ($number_of_commits: Int!) {
  repository(name: "node-github-graphql", owner: "wilsonchingg") {
    ref(qualifiedName: "master") {
      target {
        ...handleCommits
      }
    }
  }
}

fragment handleCommits on Commit {
  id
  history(first: $number_of_commits) {
    edges {
      node {
        author {
          name
          date
        }
      }
    }
  }
}`, {
  'number_of_commits': 3
}
).then(function (res) {
  console.log(JSON.stringify(res, null, 2))
}).catch((err) => { console.log(err) })
```

### API Reference

#### new GithubGraphQLApi(options) ####

**- options**

Type: objects

The accepted keys are as below:


| Key             | Value                               |
|-----------------|-------------------------------------|
| Promise/promise | The promise object                  |
| token           | Github API key(**Mandatory**)       |
| debug           | To turn on debug log (boolean)      |
| userAgent       | User-Agent if specified             |
| url             | Alternative url to send the request |

#### github.request(query, variables, callback) ####

**- query**

Type: string

GraphQL query

**- variables (optional)**

Type: object

Dynamic arguments to be passed inside the query string. See http://graphql.org/learn/queries/#variables

**- callback (optional)**

Type: function (string response, string error)

If callback is specified, it will be used instead of promises.

### LICENSE

MIT license. See the LICENSE file for details.
