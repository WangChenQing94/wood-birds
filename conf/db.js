const mongoose = require('mongoose')

const dbName = 'wood_birds'
const dbAddr = `mongodb://localhost:27017`
mongoose.connect(dbAddr, { dbName: dbName, useNewUrlParser: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('Error')
})
db.once('open', () => {
  console.log('connected')
})

module.exports = mongoose