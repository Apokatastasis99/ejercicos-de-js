const Route = require('lib/router/route')
const { Thesis } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const theses = await Thesis.dataTables({
      limit: ctx.request.query.limit || 100,
      skip: ctx.request.query.start,
      find: {isDeleted: false},
      sort: ctx.request.query.sort || '-createdAt'
    })

    ctx.body = theses
  }
})
