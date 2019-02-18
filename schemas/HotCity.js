const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  // 城市名
  name: String,
  // 城市编码
  code: String,
  // 城市图片
  url: String,
  // 创建时间
  createTime: Number,
}, {
  versionKey: false
})


module.exports = mongoose.model('hot_city', schema)