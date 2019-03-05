const mongoose = require('mongoose')

const dbName = 'wood_birds'
const dbAddr = `mongodb://127.0.0.1:27017`
mongoose.connect(dbAddr, { dbName: dbName, useNewUrlParser: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('Error, Mongodb is not connect')
})
db.once('open', () => {
  console.log('Mongodb is connected')
})

module.exports = mongoose