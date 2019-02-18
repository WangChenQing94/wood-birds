const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 房屋Id
  houseId: String,
  // 用户头像链接
  avatarUrl: String,
  // 微信昵称
  name: String,
  // 评论内容
  content: String,
  // 评分
  score: Number,
  // 房东回复
  reply: Array,
  // 创建时间
  createTime: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('evaluate', schema);
