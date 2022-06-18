const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const appVersion = "1.0.0"

const schema = buildSchema(`

    scalar Date

    type Announcement {
        _id: String,
        userId: String
        title: String
        content: [String]
        createTime: Date
    }

    type Query {
        hello: String

        announcement(limit: Int, skip: Int): [Announcement!]
    }

`)

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