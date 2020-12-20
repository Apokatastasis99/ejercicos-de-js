const Route = require('lib/router/route')
const { History, Thesis } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid/history',
  handler: async function (ctx) {
    const { uuid } = ctx.params;

    const thesis = await Thesis.findOne({ uuid })
    ctx.assert(thesis, 404, 'Thesis Not Found')

    const {
      limit,
      start,
      sort
    } = ctx.request.query

    const histories = await History.dataTables({
      limit: limit || 20,
      skip: start,
      find: {
        collectionId: thesis._id
      },
      populate: 'user',
      sort: sort || '-timestamp'
    })

    ctx.body = histories
  }
})
