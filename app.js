const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const fs = require('fs')

const appVersion = "1.0.0"

// 用于版本更新验证的数字版本号
// 在游戏歇逼的时候最后更新到 81
const latestGameVersion = 81

// 在真正接入数据库之前创建的假数据
// 将在实现数据持久化后移除
const fakeEntities = {
    fakeUser: {
        "_id": 10000,
        "username": "匿名用户",
        "ownChart": [],
        "coworkChart": [],
        "ownSet": [],
        "follower": 0,
        "coin": 9999,
        "diamond": 9999,
        "PPTime": "0",
        "token": "trash-potato-server-but-online", // 'trash-potato-server' 为离线用户的 Token
        "RThisMonth": 1000,
        "access": {
            "reviewer": true
        }
    }
}

const schema = buildSchema(fs.readFileSync('dynamite.graphql').toString())

const root = {
    hello() {
        return `Explode in Node v${appVersion}`
    },

    // 游戏中没有实际实现，所以直接返回空数组
    announcement(limit, skip) {
        return []
    },

    gameSetting() {
        return {
            appVer: latestGameVersion,

            // 不知道这些数据对游戏的影响
            judgement: {
                perfect: 0,
                good: 0,
                miss: 0,
                maxHp: 0,
                startHp: 0
            }
        }
    },

    loginUser(username, password) {
        return fakeEntities.fakeUser
    },

    registerUser(username, password) {
        return fakeEntities.fakeUser
    },
}

const app = express()
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
app.listen(10443)

console.log("Running: http://localhost:10443/graphql")