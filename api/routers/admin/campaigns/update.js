const Route = require('lib/router/route')
const lov = require('lov')
const slugify = require('underscore.string/slugify')

const { Campaign } = require('models')

module.exports = new Route({
  method: 'put',
  path: '/:uuid',
  validator: lov.object().keys({
    name: lov.string(),
    description: lov.string()
  }),
  handler: async function (ctx) {
    const { uuid } = ctx.params
    const { body } = ctx.request

    const campaign = await Campaign.findOne({ uuid })
    ctx.assert(campaign, 404, 'Campaign not found')

    campaign.set(body)
    await campaign.save()

    ctx.body = {
      data: campaign.toAdmin()
    }
  }
})
