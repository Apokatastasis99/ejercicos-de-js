// node tasks/theses/export --from 2000 --to 2017
require('../../config')
require('lib/databases/mongo')

const { Thesis } = require('models')
const Task = require('lib/task')
const fs = require('fs')
const json2csv = require('json2csv')

const task = new Task(async function (argv) {
  let { from, to } = argv

  const utimestamp = Math.floor(new Date() / 1000)
  const file = 'tmp/thesis-' + utimestamp + '.csv'

  const query = {}

  if (from) {
    query.year = query.year || {}
    query.year.$gte = from
  }

  if (to) {
    query.year = query.year || {}
    query.year.$lte = to
  }

  const data = await Thesis.find(query).sort('-year').lean()

  fs.writeFileSync(file, json2csv({ data }))

  return { theses: data.length, file }
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
