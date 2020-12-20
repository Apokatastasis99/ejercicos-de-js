// node tasks/theses/clean
require('../../config')
require('lib/databases/mongo')

const { Thesis } = require('models')
const Task = require('lib/task')
const { extract } = require('keyword-extractor')
const filters = require('lib/filters')

let setted = 0
let failed = 0

const task = new Task(async function (argv) {
  const theses = await Thesis.find()

  for (let thesis of theses) {
    try {
      const { title, author, year, fields } = thesis.rawData

      thesis.author = author.trim()
      thesis.title = title.trim()
      thesis.year = year.trim().replace('[', '').replace(']', '')
      thesis.keywords = extract(title, {
        language: 'spanish',
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
      })

      let advisors = fields['Sustentante/Asesor']
      let degree = fields['Grado']
      let institution = fields['Sec Corporativo']
      let college = fields['Universidad']

      if (Array.isArray(advisors)) {
        advisors[0] && (thesis.advisor = filters.fullname(advisors[0]))
        advisors[1] && (thesis.advisor2 = filters.fullname(advisors[1]))
        advisors[2] && (thesis.advisor3 = filters.fullname(advisors[2]))
        advisors[4] && (thesis.advisor4 = filters.fullname(advisors[4]))
      } else {
        thesis.advisor = filters.fullname(advisors)
      }

      thesis.degree = degree.trim()
      thesis.college = college.trim()
      thesis.institution = filters.institution(institution)

      await thesis.save()
      console.log('Setted =>', thesis.uuid)
      setted++
    } catch (e) {
      console.log('Error =>', thesis.uuid, e)
      failed++
    }
  }

  return { theses: theses.length, setted, failed }
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
