const DBWrapper = require('../DBWrapper.js')

const Schemas = require('./Schemas.js')
const mongoose = require('mongoose')

module.exports = class MongoDB extends DBWrapper {
  constructor (options = {}) {
    super(options)
    this.mongoose = mongoose // Debug purpose
    this.URI = process.env.MONGODB_URI
    this.Models = {}
  }

  connect () {
    return mongoose.connect(this.URI, this.options).then(() => {
      Object.keys(Schemas).forEach(k => {
        this.Models[k] = mongoose.model(k, Schemas[k])
      })
    })
  }

  async getUser (id) {
    if (!id || typeof id !== 'string') return
    const User = this.Models.User
    const user = await User.findOne({'_id': id}).then() || await new User({'_id': id}).save()
    return user
  }

  async getGuild (id) {
    if (!id || typeof id !== 'string') return
    const Guild = this.Models.Guild
    const guild = await Guild.findOne({'_id': id}).then() || await new Guild({'_id': id}).save()
    return guild
  }
}
