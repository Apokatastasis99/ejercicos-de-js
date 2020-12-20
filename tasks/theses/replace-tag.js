// node tasks/theses/replace-tag --tag filosofia --new filosofía
require('../../config')
require('lib/databases/mongo')

const { Thesis } = require('models')
const Task = require('lib/task')

const task = new Task(async function (argv) {
  if (!argv.tag) throw new Error('tag is required')

  let replaced = 0
  let failed = 0

  const theses = await Thesis.find({
    keywords: argv.tag
  })

  for (let thesis of theses) {
    try {
      await Thesis.update({
        _id: thesis._id,
        keywords: argv.tag
      }, {
        $set: {
          'keywords.$': argv.new
        }
      })
      replaced++
    } catch (e) {
      console.log('error =>', e)
      failed++
    }
  }

  return { theses: theses.length, replaced, failed }
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
