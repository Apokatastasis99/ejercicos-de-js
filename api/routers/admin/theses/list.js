const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')

const { Thesis } = require('models')

const queryParams = new QueryParams()
queryParams.addFilter('year', (filters, year) => {
  filters.year = year
})

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

    let search = {}
    if (filters.search) {
      search = {
        value: String(filters.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        fields: [
          'title',
          'author',
          'gender',
          'advisor',
          'advisor2',
          'advisor3',
          'degree',
          'college',
          'institution'
        ],
      }
      delete filters.search
    }

    const theses = await Thesis.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      search,
      find: {
        isDeleted: false,
        ...filters
      },
      sort: ctx.request.query.sort || '-createdAt'
    })

    ctx.body = theses
  }
})
