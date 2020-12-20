const Route = require('lib/router/route')
const { Campaign } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    const { uuid } = ctx.params

    const campaign = await Campaign.findOne({ uuid }).populate('author')
    ctx.assert(campaign, 404, 'Campaign not found')

    ctx.body = {
      data: campaign.toAdmin()
    }
  }
})
