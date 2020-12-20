const Route = require('lib/router/route')

const { Campaign } = require('models')

module.exports = new Route({
  method: 'put',
  path: '/:uuid/routes/:routeIndex',
  handler: async function (ctx) {
    const { user } = ctx.state
    const { uuid, routeIndex } = ctx.params
    const { body } = ctx.request

    const campaign = await Campaign.findOne({ uuid })
    ctx.assert(campaign, 404, 'Campaign not found')

    const currentRoute = campaign.routes[routeIndex]

    const data = {
      agent: user,
      completed: body.completed,
      updatedAt: Date.now()
    }

    await Campaign.updateOne({
      'routes._id': currentRoute._id
    }, {
      $set: {
        'routes.$': data
      }
    })

    ctx.body = {
      data: campaign.toAdmin()
    }
  }
})
