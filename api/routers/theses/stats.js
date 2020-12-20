const Route = require('lib/router/route')
const { Thesis } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/stats',
  handler: async function (ctx) {
    const thesesCount = await Thesis.count()
    const thesesFirstDegreeCount = await Thesis.count({ degree: /licenciatura/i })
    const thesesSecondDegreeCount = await Thesis.count({ degree: /maestría/i })
    const thesesThirdDegreeCount = await Thesis.count({ degree: /doctorado/i })
    const thesesAuthors = await Thesis.aggregate([{
      $group: { _id: { author: '$author' } }
    }])
    const thesesAdvisors = await Thesis.aggregate([{
      $group: { _id: { advisor: '$advisor' } }
    }])

    ctx.body = {
      thesesCount,
      thesesFirstDegreeCount,
      thesesSecondDegreeCount,
      thesesThirdDegreeCount,
      thesesAuthorsCount: thesesAuthors.length,
      thesesAdvisorsCount: thesesAdvisors.length
    }
  }
})
