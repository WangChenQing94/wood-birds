const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 微信Openid
  openId: String,
  // 微信昵称
  name: String,
  // 微信头像链接
  avatarUrl: String,
  // token (暂无)
  // token: String,
  // 手机号
  phone: String,
  // 密码
  password: String,
  // 创建时间
  createTime: Number,
}, {
  versionKey: false
})

module.exports = mongoose.model('user', schema);

