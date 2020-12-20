const Route = require('lib/router/route')
const { Campaign } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const campaigns = await Campaign.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: { isDeleted: false },
      sort: ctx.request.query.sort || '-createdAt',
      populate: 'author'
    })

    ctx.body = campaigns
  }
})
