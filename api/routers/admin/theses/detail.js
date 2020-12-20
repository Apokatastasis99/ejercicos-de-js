const Route = require('lib/router/route')
const { Thesis } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    const { uuid } = ctx.params

    const thesis = await Thesis.findOne({ uuid })
    ctx.assert(thesis, 404, 'Thesis Not Found')

    ctx.body = {
      data: thesis.format()
    }
  }
})
