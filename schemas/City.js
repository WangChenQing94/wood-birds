
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  // 城市编码
  code: String,
  // 城市名
  name: String,
  // 父级编码
  parentCode: String,
  // 是否是热门城市
  isHot: Boolean,
  // 城市图片
  url: String,
  // 创建时间
  createTime: Number,
}, {
  versionKey: false
})

module.exports = mongoose.model('city', schema);
