const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const dataTables = require('mongoose-datatables')

const historySchema = new Schema({
  collectionName: { type: String },
  collectionId: { type: Schema.Types.ObjectId },
  data: Schema.Types.Mixed,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  collection: '__histories'
})

historySchema.plugin(dataTables)

module.exports = mongoose.model('History', historySchema)
