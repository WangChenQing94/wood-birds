
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  // 房屋名称
  name: String,
  // 用户id
  userId: String,
  // 房子图片
  images: Array,
  // 房屋价格
  price: Number,
  // 房屋价格
  area: Number,
  // 租赁方式 - 整租 0|合租 1
  lease: String,
  // 楼房类型 - 公寓 0|民居 1|客栈 2
  buildType: String,
  // 房屋类型 - 一室 0|二室 1|三室 2|四室以上 3
  houseType: String,
  // 床型 - 单人床 0|双人床 1|其他 2
  bedType: String,
  // 卫生间 - 独立 0|公共 1
  toilet: String,
  // 居住人数
  peoples: Number,
  // 评分 (最高5.0)
  score: String,
  // 评价数量
  evaluate: String,
  // 省份
  province: String,
  // 城市
  city: String,
  // 地区
  region: String,
  // 详细地址
  addrDetail: String,
  // 经纬度 定位
  location: Object,
  // 入住时间
  beginTime: Number,
  // 退房时间
  endTime: Number,
  // 详情
  details: {
    // 房源描述
    describe: String,
    // 定位
    coordinate: Array,
  },
  // 配套设施
  configure: {
    // 无线WIFI
    net: Boolean,
    // 电视
    tv: Boolean,
    // 淋浴
    shower: Boolean,
    // 空调
    air: Boolean,
    // 暖气
    heating: Boolean,
    // 洗衣机
    washer: Boolean,
    // 电冰箱
    freezer: Boolean,
    // 全天热水
    hotWater: Boolean,
    // 厨房
    kitchen: Boolean,
    // 毛巾
    towel: Boolean,
    // 拖鞋
    slipper: Boolean,
    // 一次性用品
    once: Boolean,
    // 热水壶
    kettle: Boolean,
    // 电梯
    elevator: Boolean,
    // 餐具炊具
    tableware: Boolean,
    // 吹风机
    blower: Boolean,
    // 智能门锁
    smartLock: Boolean,
    // 允许做饭
    cook: Boolean
  },
  // 须知
  notes: {
    // 最早入住时间
    checkInTime: String,
    // 最晚退房时间
    checkOutTime: String,
    // 最少入住天数
    daysToStay: Number,
    // 身份证
    idCard: Boolean,
    // 线下押金
    deposit: Boolean,
    // 房东要求
    landlordReq: String,
    // 入住须知
    notice: String
  },
  // 创建时间
  createTime: Number,
}, {
  versionKey: false
})

module.exports = mongoose.model('house', schema);
