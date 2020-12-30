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
                  $and: [
                    { $eq: ['$gender', 'male'] }
                  ]
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
                  $and: [
                    { $eq: ['$gender', 'female'] }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          maleBachelor: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$gender', 'male'] },
                    { $regexMatch: { input: '$degree', regex: /licenciatura/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          femaleBachelor: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$gender', 'female'] },
                    { $regexMatch: { input: '$degree', regex: /licenciatura/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          maleMaster: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$gender', 'male'] },
                    { $regexMatch: { input: '$degree', regex: /maestria|maestría/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          femaleMaster: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$gender', 'female'] },
                    { $regexMatch: { input: '$degree', regex: /maestria|maestría/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          maleDoctorate: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$gender', 'male'] },
                    { $regexMatch: { input: '$degree', regex: /doctorado/gi } }
                  ]
                },
                then: 1,
                else: 0
              }
            }
          },
          femaleDoctorate: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$gender', 'female'] },
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
          male: '$male',
          female: '$female',
          maleBachelor: '$maleBachelor',
          femaleBachelor: '$femaleBachelor',
          maleMaster: '$maleMaster',
          femaleMaster: '$femaleMaster',
          maleDoctorate: '$maleDoctorate',
          femaleDoctorate: '$femaleDoctorate'
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
