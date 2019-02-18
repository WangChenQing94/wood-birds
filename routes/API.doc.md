# **接口文档**

## 状态码
-1 连接错误

0 成功

1 异常

4 登陆超时

## 1. 首页
### 接口: /home &nbsp; GET
```
返回
  code: 0,
  data: {
    // 轮播图
    "banners": [
        "http://localhost:3000/shanghai.jpg"
    ],
    // 热门城市
    "hotCitys": [
        {
          "name": "上海",
          "code": "1", // 城市编码
          "url": "http://localhost:3000/images/home/shanghai.jpg" // 城市图片
        },
        {
          "name": "北京",
          "code": "2",
          "url": "http://localhost:3000/images/home/beijing.png"
        }
    ]
  }
```

--------

## 2.资源类接口
### 2.1 获取热门城市
### 接口：/resource/hotCity &nbsp; GET
```
  {
    "code": 0,
    "data": [
        {
          "name": "上海",
          "code": "1" // 城市编码
        },
        {
          "name": "北京",
          "code": "2"
        }
    ]
}
```

### 2.2 搜索目的地
### 接口：/resource/search &nbsp; POST

```
  参数
    name: String, // must
```
```
返回
  code: 0,
  data: [
    {
      // 地点名称
      name: '',
      // 地点编码
      code: ''
    }
  ]
```

### 2.3 获取房源列表
### 接口：/resource/list &nbsp; POST
```
  参数
    code: String, // 地区编码 Option
    beginTime: 时间戳, // 入住时间 Option
    endTime: 时间戳, // 退房时间 Option
    minPrice: Number, // 最低价格 Option
    maxPrice: Number, // 最高价格 Option
    peoples: Number, // 入住人数 Option
    lease: Number, // 租赁方式 Option
    bedType: Number, // 房间床型 Option
    houseType: Number, // 户型 Option
    toilet: Number, // 卫生间 Option
    pageNo: Number, // 页码 must
    pageSize: Number, // 页数 must
    sort: String, // 排序 must(暂无)
```
```
返回
  code: 0,
  data: [
    {
      houseId: '', // 房源Id
      name: '', // 房屋名称
      images: [], // 图片
      price: 0, // 价格
      lease: 1, // 整租|单间
      bedType: 1, // 单人床|双人床|其他
      houseType: 1, // 一室|二室|三室|四室以上
      buildType: 1, // 公寓|民居|客栈
      toilet: 0, // 独立|公共
      peoples: 2, // 宜居人数
      score: '5.0', // 评价
      evaluate: '15', // 评论数
      province: '', // 省份
      city: '', // 城市
      region: '', // 地区
      beginTime: 时间戳, 入住时间
      endTime: 时间戳, 退房时间
    }
  ]
```

### 2.4 获取房屋详情
### 接口：/resource/houseDetail &nbsp; GET
```
  参数
    houseId: String, // 房源Id must
```
```
返回
  code: 0,
  data: {
    // 房屋照片
    banners: [],
    users: {
      // 房主姓名
      name: '',
      // 房主头像
      avatar: ``,
      // 房主电话
      tel: ''
    },
    houses: {
      // 面积
      area: 70,
      // 租赁类型
      lease: '整租',
      // 房屋类型
      buildType: '民居',
      // 房屋格局
      houseType: '2室1厅',
      // 居住人数
      peoples: '4',
      // 厕所
      toilet: '1',
      // 床位
      bed: '1',
      // 房屋描述
      describe: '',
      // 评价
      scores: null,
      // 地址
      addr: '上海浦东新区',
      // 坐标
      coordinate: ['110', '45']
    },
    configure: {
      net: '无线WIFI',
      tv: '电视',
      shower: '淋浴',
      air: '空调',
      heating: '暖气',
      washer: '洗衣机',
      freezer: '电冰箱',
      hotWater: '全天热水',
      kitchen: '厨房',
      towel: '毛巾',
      slipper: '拖鞋',
      once: '一次性用品',
      kettle: '热水壶',
      elevator: '电梯',
      tableware: '餐具炊具',
      blower: '吹风机',
      smartLock: '智能门锁',
      cook: '允许做饭'
    },
    notes: {
      // 最早入住时间
      checkInTime: '',
      // 最晚退房时间
      checkOutTime: '',
      // 最少入住天数
      daysToStay: '',
      // 房间编号
      houseNum: '',
      // 身份证
      idCard: '',
      // 线下押金
      deposit: '',
      // 房东要求
      landlordReq: '',
      // 入住须知
      notice: '',
      // 允许聚餐
      allowDinner: '',
      // 水电费
      waterAndEl: '',
      // 额外加床
      extraBed: '',
      // 机场/火车站接送
      relay: ''
    }
  }
```

### 2.5 获取房屋评论
### 接口：/resource/evaluate &nbsp; GET
```
  参数
    houseId: String // 房源Id must
```

### 2.6 添加房屋评论
### 接口：/resource/addEvaluate &nbsp; POST
```
  参数
    houseId: String, // 房源Id must
    avatarUrl: String, // 用户头像 must
    name: String, // 用户昵称 must
    content: String, // 评论内容 must
    score: Number // 评分(最高5分) must
```

-------------------------

## 3.账户类接口
### 3.1 小程序登陆
### 接口: /account/wxlogin &nbsp; POST
```
  参数
    phone: String, // 手机号 must
    password: String, // 密码 must (MD5加密规则 -> 手机号 加上 密码的加密，然后整个加密)
    name: String, // 昵称 must
    code: String, // 微信code must
    avatarUrl: String, // 用户头像 must
```
```
  返回
  code: 0,
  data: {
    userId: '', // 用户id
  },
  msg: '登录成功'
```

### 3.2 后台登陆
### 接口: /account/login &nbsp; POST
```
  参数
    phone: String, // 手机号 must
    password: String, // 密码 must (MD5加密规则 -> 手机号 加上 密码的加密，然后整个加密)
```

## 4.文章类接口
### 4.1 获取文章列表
### 接口: /discover/wonderful &nbsp; GET
```
  参数
    pageNo: Number, // 页码 must
    pageSize: Number, // 页数 must
```

### 4.2 查看文章详情
### 接口: /discover/articleDetail &nbsp; GET
```
  参数
    id: String // 文章id must
```

## 5.订单类接口
### 5.1 生成订单
### 接口：/order/generateOrder &nbsp; POST
```
  参数
    houseId: String, // 房源Id must
    userId: String, // 用户Id must
    beginTime: Number, // 入住日期 must
    endTime: Number, // 离开日期 must
    name: String, // 房客姓名 option
    phone: String, // 手机号 must
    totalPrice: Number, // 总价 must
```

### 5.2 订单确认支付
### 接口：/order/confirmPayment &nbsp; POST
```
  参数
    orderId: String, // 订单号 must
    totalPrice: Number, // 总价 must
```

### 5.3 订单列表
### 接口：/order/getOrderList &nbsp; POST
```
  参数
    status: Number, // 状态 0 进行中 1 已结果 must
    userId: String, // 用户Id must
    pageSize: Number, // 页数 must
    pageNo: Number, // 页码
```