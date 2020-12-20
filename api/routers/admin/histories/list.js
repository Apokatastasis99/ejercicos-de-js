const Route = require('lib/router/route')
const models = require('models')
const { History } = models
const _ = require('lodash')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const {
      limit,
      start,
      sort
    } = ctx.request.query

    const histories = await History.dataTables({
      limit: limit || 20,
      skip: start,
      find: {},
      populate: 'user',
      sort: sort || '-timestamp'
    })

    const data = _.cloneDeep(histories.data)
    for (let i = 0; i < data.length; i++) {
      const history = data[i]
      const Model = models[history.collectionName]
      if (Model) {
        history.data = await Model.findOne({ _id: history.collectionId })
      }
    }

    ctx.body = { ...histories, data }
  }
})
