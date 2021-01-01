const Route = require('lib/router/route')
const { Thesis } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/degrees-years',
  handler: async function (ctx) {
    const years = await Thesis.aggregate([
      {
        $match: {
          isDeleted: false
        }
      },
      {
        $group: {
          _id: {
            year: '$year'
          },
          count: {
            $sum: 1
          },
          bachelor: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $regexMatch: { input: '$degree', regex: /licenciatura/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          master: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $regexMatch: { input: '$degree', regex: /maestria|maestría/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          doctorate: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $regexMatch: { input: '$degree', regex: /doctorado/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          count: '$count',
          bachelor: '$bachelor',
          master: '$master',
          doctorate: '$doctorate'
        }
      },
      {
        $sort: {
          year: -1
        }
      }
    ])

    ctx.body = years
  }
})
