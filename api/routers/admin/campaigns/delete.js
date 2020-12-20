const Route = require('lib/router/route')
const { Campaign } = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    const { uuid } = ctx.params

    const campaign = await Campaign.findOne({ uuid }).populate('author')
    ctx.assert(campaign, 404, 'Campaign not found')

    campaign.set({ isDeleted: true })
    campaign.save()

    ctx.body = {
      data: campaign.toAdmin()
    }
  }
})
