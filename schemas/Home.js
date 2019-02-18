const mongoose = require('mongoose')

let schema = new mongoose.Schema({
  hotCitys: []
}, {
  versionKey: false
})

// schema.methods.speak = function () {
//   let greeting = this.name ? 'Meow name is ' + this.name : 'I don`t have a name'
//   console.log(greeting)
// }

// schema.virtual('fullName').get(function () {
//   return this.name.first + ' ' + this.name.last
// })

module.exports = mongoose.model('home', schema)