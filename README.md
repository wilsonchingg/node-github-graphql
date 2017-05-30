## Node-Github-GraphQL

A GitHub GraphQL HTTP wrapper

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
query ($number_of_repos: Int!) {
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
  history(first: $number_of_repos) {
    pageInfo {
      hasNextPage
    }
    edges {
      node {
        messageHeadline
        oid
        message
        author {
          name
          email
          date
        }
      }
    }
  }
}`, {
  'number_of_repos': 3
}
).then(function (res) {
  console.log(JSON.stringify(res, null, 2))
}).catch((err) => { console.log(err) })
```

### LICENSE

MIT license. See the LICENSE file for details.
