const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const fs = require('fs')
const exp = require('constants')

const appVersion = "1.0.0"

// 用于版本更新验证的数字版本号
// 在游戏歇逼的时候最后更新到 81
const latestGameVersion = 81

// 在真正接入数据库之前创建的假数据
// 将在实现数据持久化后移除
const fakeEntities = {}

fakeEntities['fakeUser'] = newUser("10000", "测试用户", [], [], [], 0, 9999, 9999, Date.UTC(2022, 1, 1), "fake-token", 1000, true)
fakeEntities['fakePlayer'] = newPlayer("10000", "测试玩家", 5, 10000)
fakeEntities['fakeChart'] = newChartSet("1", "nope", 1, "FakeNoter", "FakeMusic", "FakeComposer", 114514, [newChart("1", 1, 15)], true, true, null)
fakeEntities['fakeDetailedChart'] = newDetailedChart(fakeEntities.fakeUser, "FakeDetailedChart", 0, newMusic("111", "FakeMusic", "FakeMusician"), 3, 20)
fakeEntities['fakePlayRecordWithRank'] = newPlayRecordWithRank(fakeEntities.fakePlayer, 1.0, 1.0, true, false, 1, 1000000, 1145, 14, 19, new Date().toUTCString())
// 考级用谱
fakeEntities['fakeChart4A1'] = newChartSet("c4a1", "nope", 1, "FakeNoter", "FakeMusic4Assessment1", "FakeComposer", 114514, [newChart("assessment_1", 1, 15)], true, true, null)
fakeEntities['fakeChart4A2'] = newChartSet("c4a2", "nope", 1, "FakeNoter", "FakeMusic4Assessment2", "FakeComposer", 114514, [newChart("assessment_2", 1, 15)], true, true, null)
fakeEntities['fakeChart4A3'] = newChartSet("c4a3", "nope", 1, "FakeNoter", "FakeMusic4Assessment3", "FakeComposer", 114514, [newChart("assessment_3", 1, 15)], true, true, null)
fakeEntities['fakeAssessmentGroup'] = newAssessmentGroup("1", "Au, the Faker", [newAssessment("1", "1", 1.0, 1.0, 1.0, 1.0, [newAssessmentChart("assessment_1", fakeEntities.fakeChart4A1), newAssessmentChart("assessment_2", fakeEntities.fakeChart4A2), newAssessmentChart("assessment_3", fakeEntities.fakeChart4A3)], [newAssessmentRecord(100.0, true, [newAssessmentPlayRecord(1000, 0, 0, 1000000), newAssessmentPlayRecord(1000, 0, 0, 1000000), newAssessmentPlayRecord(1000, 0, 0, 1000000)])])])
// 考级排名
fakeEntities['fakeAssessmentPlayRecordWithRank1'] = newAssessmentRecordWithRank(fakeEntities.fakePlayer, 1, 100.0, 100, new Date().toUTCString())
fakeEntities['fakeAssessmentPlayRecordWithRank2'] = newAssessmentRecordWithRank(fakeEntities.fakePlayer, 2, 100.0, 100, new Date().toUTCString())
fakeEntities['fakeAssessmentPlayRecordWithRank3'] = newAssessmentRecordWithRank(fakeEntities.fakePlayer, 3, 100.0, 100, new Date().toUTCString())
fakeEntities['fakeAssessmentPlayRecordWithRank4'] = newAssessmentRecordWithRank(fakeEntities.fakePlayer, 4, 100.0, 100, new Date().toUTCString())
fakeEntities['fakeAssessmentPlayRecordWithRank5'] = newAssessmentRecordWithRank(fakeEntities.fakePlayer, 5, 100.0, 100, new Date().toUTCString())
fakeEntities['fakeAssessmentPlayRecordWithRanks'] = [fakeEntities.fakeAssessmentPlayRecordWithRank1, fakeEntities.fakeAssessmentPlayRecordWithRank2, fakeEntities.fakeAssessmentPlayRecordWithRank3, fakeEntities.fakeAssessmentPlayRecordWithRank4, fakeEntities.fakeAssessmentPlayRecordWithRank5]
// 审核（Review）
fakeEntities['fakeReviewRequest1'] = newReviewRequest(fakeEntities.fakeChart, false)
// 普通排名
fakeEntities['fakePlayRecordWithRank1'] = newPlayRecordWithRank(fakeEntities.fakePlayer, 1.0, 1.0, true, false, 1, 1000000, 1145, 14, 19, new Date().toUTCString())
fakeEntities['fakePlayRecordWithRank2'] = newPlayRecordWithRank(fakeEntities.fakePlayer, 1.0, 1.0, true, false, 1, 1000000, 1145, 14, 19, new Date().toUTCString())
fakeEntities['fakePlayRecordWithRank3'] = newPlayRecordWithRank(fakeEntities.fakePlayer, 1.0, 1.0, true, false, 1, 1000000, 1145, 14, 19, new Date().toUTCString())
fakeEntities['fakePlayRecordWithRank4'] = newPlayRecordWithRank(fakeEntities.fakePlayer, 1.0, 1.0, true, false, 1, 1000000, 1145, 14, 19, new Date().toUTCString())
fakeEntities['fakePlayRecordWithRank5'] = newPlayRecordWithRank(fakeEntities.fakePlayer, 1.0, 1.0, true, false, 1, 1000000, 1145, 14, 19, new Date().toUTCString())
fakeEntities['fakePlayRecordsWithRank'] = [fakeEntities.fakePlayRecordWithRank1, fakeEntities.fakePlayRecordWithRank2, fakeEntities.fakePlayRecordWithRank3, fakeEntities.fakePlayRecordWithRank4, fakeEntities.fakePlayRecordWithRank5]
// 假数据结束

const schema = buildSchema(fs.readFileSync('dynamite.graphql').toString())

const root = {
    hello() {
        return `Explode in Node v${appVersion}`
    },

    self(_, { soudayo }) {
        soudayo = soudayo || "trash-potato-server" // 默认值设置为离线的凭证 'trash-potato-server'
        console.log(`S: ${soudayo}`) // todo: remove
        return {
            "gotSet": function() { // 这里有个本体自身的bug，已经拥有的列表会无限循环下去。
                return [fakeEntities.fakeChart]
            },
            "assessmentRankSelf": function({ assessmentGroupId, medalLevel }) {
                return fakeEntities.fakeAssessmentPlayRecordWithRank1
            },
            "playRankSelf": function({ chartId }) {
                return fakeEntities.fakePlayRecordWithRank
            }
        }
    },

    reviewer(_, { soudayo }) {
        soudayo = soudayo || "trash-potato-server" // 默认值设置为离线的凭证 'trash-potato-server'
        console.log(`S: ${soudayo}`) // todo: remove
        return {
            "reviewRequest": function({ limit, skip, status, searchStr }) {
                return skip < 1 ? [fakeEntities.fakeReviewRequest1] : []
            }
        }
    },

    // 游戏中没有实际实现，所以直接返回空数组
    announcement({ limit, skip }) {
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

    loginUser({ username, password }, { headers }) {
        console.log(headers)
        return fakeEntities.fakeUser
    },

    registerUser({ username, password }) {
        return fakeEntities.fakeUser
    },

    ownOrGotChart() {
        return []
    },

    // 请求考级列表时访问
    assessmentGroup({ limit, skip }) {
        return [fakeEntities.fakeAssessmentGroup]
    },

    assessmentRank({ assessmentGroupId, medalLevel, skip, limit }) {
        return skip < 5 ? fakeEntities.fakeAssessmentPlayRecordWithRanks : [] // 需要判断 skip，否则会造成排名列表无限长
    },

    // 谱面商店
    set({ playCountOrder, publishTimeOrder, limit, skip, isHidden, musicTitle, isOfficial, isRanked }) {
        return skip < 1 ? [fakeEntities.fakeChart] : []
    },

    charts({ limit, skip, ranked }) {
        return [fakeEntities.fakeDetailedChart]
    },

    playRank({ chartId, skip, limit }) {
        return skip < 5 ? fakeEntities.fakePlayRecordsWithRank : []
    },

    refreshSet({ setVersion }) { // todo
        console.error("Unsupported Method (refreshSet) invoked.")
        return null
    },

    setById({ _id }) {
        return fakeEntities.fakeChart
    },

    userByUsername({ username }) {
        return fakeEntities.fakeUser
    },

    exchangeSet({ setId }) {
        return {
            "coin": 114514
        }
    },

    submitBeforePlay({ chartId, PPCost, eventArgs }) {
        return newBeforePlaySubmit(new Date().toUTCString(), "RaNDoMiD")
    },

    submitAfterPlay({ randomId, playRecord }) {
        console.log(playRecord)
        return newAfterPlaySubmit(newRanking(true, 1), 9999, -1024, 4096)
    },

    submitBeforeAssessment({ assessmentGroupId, medalLevel }) {
        return newBeforePlaySubmit(new Date().toUTCString(), "aSseSSmEnT")
    },

    submitAfterAssessment({ playRecords, randomId }) {
        console.log(playRecords)
        return newAssessmentAfterPlaySubmit(1, 7890, 1234, 1234)
    },

    purchaseChart({ chartId }) {
        return fakeEntities.fakeUser
    }
}

function contextFactory(req) {
    return {
        headers: req.headers,
        soudayo: req.headers["x-soudayo"],
        version: req.headers["x-version"]
    }
}

const expressApi = express()
expressApi.use('/graphql', graphqlHTTP(request => ({
    schema: schema,
    rootValue: root,
    context: contextFactory(request),
    graphiql: true
})))
expressApi.listen(10443)

console.log("Backend Server Running at http://localhost:10443/graphql")

const expressDispatch = express()
expressDispatch.use('/', express.static('data'))
expressDispatch.use('/download/cover/encoded/', express.static('data/cover'))
expressDispatch.use('/download/music/encoded/', express.static('data/music'))
expressDispatch.use('/download/chart/encoded/', express.static('data/chart'))
expressDispatch.use('/download/preview/encoded/', express.static('data/preview'))
expressDispatch.use('/download/avatar/256x256_jpg/', express.static('data/avatar'))
expressDispatch.use('/download/cover/480x270_jpg/', express.static('data/cover_small'))
expressDispatch.listen(10442)

console.log("Dispatch Server Running at http://localhost:10442")

/**
 * 
 * @param {String} id ID
 * @param {String} username 用户名
 * @param {Array} ownChart 未知
 * @param {Array} coworkChart 未知
 * @param {Array} ownSet 未知
 * @param {Number} follower 未知使用
 * @param {Number} coin 金币数（菱形）
 * @param {Number} diamond 钻石数
 * @param {Number} PPTime PPTime
 * @param {String} token Token
 * @param {Number} RThisMonth RThisMonth
 * @param {Boolean} reviewAcc 是否拥有预览权限
 * @returns User
 */
function newUser(id, username, ownChart, coworkChart, ownSet, follower, coin, diamond, PPTime, token, RThisMonth, reviewAcc) {
    return {
        "_id": id,
        "username": username,
        "ownChart": ownChart,
        "coworkChart": coworkChart,
        "ownSet": ownSet,
        "follower": follower,
        "coin": coin,
        "diamond": diamond,
        "PPTime": PPTime,
        "token": token,
        "RThisMonth": RThisMonth,
        "access": {
            "reviewer": reviewAcc
        }
    }
}

/**
 * 
 * @param {String} id ID
 * @param {String} musicName 音乐名称
 * @param {String} musicianName 
 * @returns 
 */
function newMusic(id, musicName, musicianName) {
    return {
        "_id": id,
        "musicName": musicName,
        "musician": {
            "musicianName": musicianName
        }
    }
}

function newDetailedChart(charter, chartName, gcPrice, music, difficultyBase, difficultyValue) {
    return {
        "charter": charter,
        "chartName": chartName,
        "gcPrice": gcPrice,
        "music": music,
        "difficultyBase": difficultyBase,
        "difficultyValue": difficultyValue
    }
}

function newChart(id, difficultyClass, difficultyValue) {
    return {
        "_id": id,
        "difficultyClass": difficultyClass,
        "difficultyValue": difficultyValue
    }
}

function newChartSet(id, introduction, coinPrice, noterUsername, musicTitle, composerName, playCount, charts, got, ranked, overridePriceStr) {
    return {
        "_id": id,
        "introduction": introduction,
        "coinPrice": coinPrice,
        "noter": {
            "username": noterUsername
        },
        "musicTitle": musicTitle,
        "composerName": composerName,
        "playCount": playCount,
        "chart": charts,
        "isGot": got,
        "isRanked": ranked,
        "OverridePriceStr": overridePriceStr
    }
}

function newAssessmentChart(id, set) {
    return {
        "_id": id,
        "set": set
    }
}

function newAssessmentPlayRecord(perfect, good, miss, score) {
    return {
        "perfect": perfect,
        "good": good,
        "miss": miss,
        "score": score
    }
}

function newAssessmentRecord(achievementRate, best, records) {
    return {
        "achievementRate": achievementRate,
        "isBest": best,
        "playRecord": records
    }
}

function newAssessment(id, lvl, lifeBarLen, normalPassAcc, goldenPassAcc, exMiss, charts, records) {
    return {
        "_id": id,
        "medalLevel": lvl,
        "lifeBarLength": lifeBarLen,
        "normalPassAcc": normalPassAcc,
        "goldenPassAcc": goldenPassAcc,
        "exMiss": exMiss,
        "chart": charts,
        "assessmentRecord": records
    }
}

function newAssessmentGroup(id, name, assessments) {
    return {
        "_id": id,
        "name": name,
        "assessment": assessments
    }
}

function newPlayer(id, username, highestGoldenMedalLevel, RThisMonth) {
    return {
        "_id": id,
        "username": username,
        "highestGoldenMedalLevel": highestGoldenMedalLevel,
        "RThisMonth": RThisMonth
    }
}

/**
 * 
 * @param {Object} player 玩家
 * @param {Number} rank 排名
 * @param {Number} achievementRate 完成率（Float）
 * @param {Number} result 结果
 * @param {Date} createTime 游玩时间
 * @returns AssessmentRecordWithRank
 */
function newAssessmentRecordWithRank(player, rank, achievementRate, result, createTime) {
    return {
        "player": player,
        "rank": rank,
        "achievementRate": achievementRate,
        "result": result,
        "createTime": createTime
    }
}

function newPlayRecordWithRank(player, narrow, speed, bleed, mirror, rank, score, perfect, good, miss, createTime) {
    return {
        "player": player,
        "mod": {
            "narrow": narrow,
            "speed": speed,
            "isBleed": bleed,
            "isMirror": mirror
        },
        "rank": rank,
        "score": score,
        "perfect": perfect,
        "good": good,
        "miss": miss,
        "createTime": createTime
    }
}

function newReviewRequest(set, unranked) {
    return {
        "set": set,
        "isUnranked": unranked
    }
}

function newBeforePlaySubmit(PPTime, randomId) {
    return {
        "PPTime": PPTime,
        "playingRecord": {
            "randomId": randomId
        }
    }
}

function newRanking(rankUpdated, rank) {
    return {
        "isPlayRankUpdated": rankUpdated,
        "playRank": {
            "rank": rank
        }
    }
}

function newAfterPlaySubmit(ranking, RThisMonth, coin, diamond) {
    return {
        "ranking": ranking,
        "RThisMonth": RThisMonth,
        "coin": coin,
        "diamond": diamond
    }
}

function newAssessmentAfterPlaySubmit(result, RThisMonth, coin, diamond) {
    return {
        "result": result,
        "RThisMonth": RThisMonth,
        "coin": coin,
        "diamond": diamond
    }
}