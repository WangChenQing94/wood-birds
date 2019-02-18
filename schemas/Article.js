const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 文章标题
  title: String,
  // 文章内容
  content: String,
  // 文章标题图片
  bannerUrl: String,
  // 创建时间
  createTime: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('article', schema);