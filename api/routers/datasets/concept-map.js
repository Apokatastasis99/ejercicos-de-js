const Route = require('lib/router/route')
const { Thesis } = require('models')
const { chain } = require('lodash')

module.exports = new Route({
  method: 'get',
  path: '/concept-map',
  handler: async function (ctx) {
    const data = ctx.request.query
    const query = {}

    if (data.fromYear) {
      query.year = query.year || {}
      query.year.$gte = Number(data.fromYear)
    }

    if (data.toYear) {
      query.year = query.year || {}
      query.year.$lte = Number(data.toYear)
    }

    const advisors = await Thesis.aggregate([
      { $match: query },
      { $project: { advisor: 1, keywords: 1 } },
      { $unwind: '$advisor' },
      { $group: { _id: '$advisor', keywords: { $addToSet: '$keywords' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).limit(50)

    const datasetAdvisors = advisors.map(function (advisor) {
      let keywords = chain(advisor.keywords)
        .flatten()
        .countBy()
        .map((value, key) => ({ name: key, count: value }))
        .sortBy('count')
        .reverse()
        .filter(obj => obj.count > 1)
        .slice(0, 5)
        .map(obj => obj.name)
        .value()

      return [advisor._id, keywords]
    }).filter(advisor => advisor[1].length)

    const keywords = await Thesis.aggregate([
      { $match: query },
      { $project: { advisor: 1, keywords: 1 } },
      { $unwind: '$keywords' },
      {
        $group: {
          _id: '$keywords',
          advisors: { $addToSet: '$advisor' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).limit(125)

    const advisorsObject = {}
    keywords.map(function (keyword) {
      keyword.advisors.map(advisor => {
        advisorsObject[advisor] = advisorsObject[advisor] || []
        advisorsObject[advisor].push(keyword._id)
      })
    })

    const datasetKeywords = chain(advisorsObject)
      .map((value, key) => ([ key, value ]))
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 50)
      .value()

    ctx.body = {
      advisors: datasetAdvisors,
      keywords: datasetKeywords
    }
  }
})
