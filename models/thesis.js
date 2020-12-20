const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')
const historyPlugin = require('mongoose-history-plugin')

const thesisSchema = new Schema({
  uuid: { type: String, default: v4 },
  title: { type: String },
  author: { type: String },
  gender: { type: String },
  advisor: { type: String },
  advisor2: { type: String },
  advisor3: { type: String },
  degree: { type: String },
  year: { type: Number },
  college: { type: String },
  institution: { type: String },
  keywords: { type: Array },
  rawData: Schema.Types.Mixed,
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
})

thesisSchema.plugin(dataTables)
thesisSchema.plugin(historyPlugin({
  mongoose,
  ignore: ['updatedAt', 'rawData']
}))

thesisSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    title: this.title,
    gender: this.gender,
    author: this.author,
    advisor: this.advisor,
    year: this.year,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

thesisSchema.methods.format = function () {
  return {
    uuid: this.uuid,
    title: this.title,
    gender: this.gender,
    author: this.author,
    advisor: this.advisor,
    advisor2: this.advisor2,
    year: this.year,
    degree: this.degree,
    college: this.college,
    institution: this.institution,
    keywords: this.keywords,
    rawData: this.rawData,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

module.exports = mongoose.model('Thesis', thesisSchema)
