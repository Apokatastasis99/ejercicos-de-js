const Route = require('lib/router/route')
const lov = require('lov')
const slugify = require('underscore.string/slugify')

const { Campaign } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    name: lov.string().required(),
    description: lov.string().required()
  }),
  handler: async function (ctx) {
    const { user } = ctx.state

    const data = ctx.request.body
    data.author = user
    data.totalRoutes = data.routes.length

    const campaign = await Campaign.create(data)

    ctx.body = {
      data: campaign.toAdmin()
    }
  }
})
