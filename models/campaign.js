const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')

const campaignSchema = new Schema({
  uuid: { type: String, default: v4 },
  name: { type: String },
  description: { type: String },
  routes: [{
    path: { type: String },
    completed: { type: Boolean, default: false },
    agent: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date }
  }],
  currentRoute: { type: Number, default: 1 },
  totalRoutes: { type: Number },
  metadata: Schema.Types.Mixed,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'created' },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true
})

campaignSchema.plugin(dataTables)

campaignSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    routes: this.routes,
    currentRoute: this.currentRoute,
    totalRoutes: this.totalRoutes,
    metadata: this.metadata,
    author: this.author,
    status: this.status,
    isDeleted: this.isDeleted,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

campaignSchema.methods.format = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    routes: this.routes,
    currentRoute: this.currentRoute,
    totalRoutes: this.totalRoutes,
    metadata: this.metadata,
    author: this.author,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  }
}

module.exports = mongoose.model('Campaign', campaignSchema)
