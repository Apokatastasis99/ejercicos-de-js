const Route = require('lib/router/route')
const { Thesis } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/gender-years',
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
          male: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$gender', 'male']
                },
                then: 1,
                else: 0
              }
            }
          },
          female: {
            $sum: {
              $cond: {
                if: {
                  $eq: ['$gender', 'female']
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
          male: '$male',
          female: '$female'
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
