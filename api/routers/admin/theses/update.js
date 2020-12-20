const Route = require('lib/router/route')
const { Thesis } = require('models')

module.exports = new Route({
  method: 'put',
  path: '/:uuid',
  handler: async function (ctx) {
    const { uuid } = ctx.params
    const { user } = ctx.state
    const data = ctx.request.body

    const thesis = await Thesis.findOne({ uuid })
    ctx.assert(thesis, 404, 'Thesis Not Found')

    // Set history data
    thesis.__history = {
      event: 'update',
      user: user._id,
      method: 'updateThesis',
      timestamp: new Date()
    }

    thesis.set(data)
    await thesis.save()

    ctx.body = {
      data: thesis.format()
    }
  }
})
