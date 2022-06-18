const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const fs = require('fs')

const appVersion = "1.0.0"

const schema = buildSchema(fs.readFileSync('dynamite.graphql').toString())

const root = {
    hello: () => `Explode in Node v${appVersion}`,
    announcement: (limit, skip) => {
        return [{
            "_id": "1",
            "userId": "FakeUserId",
            "title": "FakeTitle",
            "content": ["ContentLine1", "ContentLine2"],
            "createTime": Date.now()
        }]
    }
}

const app = express()
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
app.listen(10443)