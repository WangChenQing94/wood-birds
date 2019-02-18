const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 房源Id
  houseId: String,
  // 用户Id
  userId: String,
  // 入住时间
  beginTime: Number,
  // 离开时间
  endTime: Number,
  // 总价
  totalPrice: Number,
  // 手机号
  phone: String,
  // 房客姓名
  name: String,
  // 支付状态
  payStatus: Boolean, // 支付 true 未支付 false
  // 创建时间
  createTime: Number,
}, {
  versionKey: false
})

module.exports = mongoose.model('order', schema);