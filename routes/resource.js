const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'public/images/resource/' });

// Schemas
const HouseSchema = require('../schemas/House');

// Model
// const HotCityModel = require('../model/hotCity');
const UserModel = require('../model/user');
const HouseModel = require('../model/house');
const CityModel = require('../model/city');
const Evaluate = require('../model/evaluate');

const Valid = require('../server/valid');
const Auth = require('../server/auth');

// 获取热门城市
router.get('/hotCity', (req, res) => {
  CityModel
    .find({ isHot: true })
    .then(({ code, data }) => {
      if (code === 0) {
        let _data = JSON.parse(JSON.stringify(data))
        _data = _data.filter(item => {
          delete item.url;
          return true
        })
        res.send({
          code: 0,
          data: _data
        })
      } else {
        res.status(500);
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500);
    })
})

/**
 * 模糊查询
 * @param {string} name must 输入目的地字段
 */
router.post('/search', (req, res) => {
  const fields = ['name'];
  if (Valid.compareField(fields, req.body, res)) return;

  CityModel
    .find({ name: { $regex: req.body.name } })
    .then(({ code, data }) => {
      if (code === 0) {
        const result = data.length && data.map(item => {
          return {
            code: item.code,
            name: item.name
          }
        })
        res.send({
          code: 0,
          data: result || null
        })
      } else {
        res.status(500)
      }
    })
})

/**
 * 添加房源
 */
router.post('/addHouse', (req, res) => {
  if (Auth.keepConversation(req, res)) return;

  const body = req.body;
  console.log('添加房源 参数 ------------- ');
  console.log(body);
  body.userId = req.session.userId;
  // 初始化参数
  body.score = '0';
  body.evaluate = '0';

  HouseModel
    .create(body)
    .then(({ code, data }) => {
      console.log('添加房源 返回值 ------------------ ')
      console.log(code)
      console.log(data)
      if (code === 0) {
        res.send({
          code: 0,
          data: null,
          msg: '添加房源成功'
        })
      } else {
        res.send({
          code: 0,
          data: null,
          msg: '添加房源失败'
        })
      }
    })
  // HouseModel
  //   .create({
  //     name: '印家',
  //     price: 450,
  //     lease: '整租',
  //     houseType: '民居',
  //     peoples: 2,
  //     score: '5.0',
  //     evaluate: 8,
  //     province: '上海',
  //     city: '上海市',
  //     region: '黄浦区',
  //   })
})

/**
 * 上传房源图片
 * @param(Array) file form-data
 */
router.post('/upload', upload.array('file', 9), (req, res) => {

  if (Auth.keepConversation(req, res)) return;

  console.log(req.files);
  console.log(req.body);
  console.log('上传文件 ---------------------- ');
  const filesUrl = [];
  if (req.files.length) {
    const files = req.files;
    for (let item of files) {
      const splits = item.originalname.split('.');
      const extname = splits[splits.length - 1];
      const resourcePath = '/images/resource/';
      fs.renameSync(path.resolve(__dirname, `../public${resourcePath}${item.filename}`), path.resolve(__dirname, `../public${resourcePath}${item.filename}.${extname}`))
      filesUrl.push(`${API}${resourcePath}${item.filename}.${extname}`)
    }
  }
  console.log(filesUrl);
  res.send({
    code: 0,
    data: filesUrl
  })
})

/**
 * 获取房源列表 DONE
 * @param {String} code 地区编码 option
 * @param {Number} beginTime 入住时间 option
 * @param {Number} endTime 退房时间 option
 * @param {String} sort 排序 must  0 默认排序(评分最高) 1 价格从高到底  2 价格从低到高 3 评分最高 
 * @param {Number} minPrice 最低价格 option
 * @param {Number} maxPrice 最高价格 option
 * @param {Number} peoples 入住人数 option
 * @param {String} lease 租赁方式 option
 * @param {String} bedType 房间床型 option
 * @param {String} houseType 户型 option
 * @param {String} toilet 卫生间 option
 * @param {Number} pageNo 页码 must
 * @param {Number} pageSize 页数 must
 */
const _r_list = '/list'
router.post(_r_list, (req, res) => {
  const fields = ['pageSize', 'pageNo', 'sort'];
  if (Valid.compareField(fields, req.body, res)) return;

  const pageSize = req.body.pageSize && Number(req.body.pageSize)
  const pageNo = req.body.pageNo && Number(req.body.pageNo)
  const limit = pageSize || 0
  const skip = (pageSize && pageNo) ? pageSize * (pageNo - 1) : 0;
  // 排序
  let sort = {};
  switch (req.body.sort.toString()) {
    case '1':
      sort = {
        'price': -1
      }
      break;
    case '2':
      sort = {
        'price': 1
      }
      break;
    case '0':
    case '3':
      sort = {
        'score': -1
      }
      break;
  }
  console.log('列表排序规则---------------')
  console.log(sort)

  delete req.body.pageSize;
  delete req.body.pageNo;

  let total = 0
  let params = [];
  let cityCode = [];
  let filter = {};

  for (let key in req.body) {
    if (req.body[key]) {
      if (key !== 'minPrice' || key !== 'maxPrice' || key !== 'code') {
        continue;
      }
      let obj = {};
      obj[key] = req.body[key];
      params.push({ $or: [obj] })
    }
  }
  if (req.body.minPrice && req.body.maxPrice) {
    params.push({ $or: [{ price: { $gte: req.body.minPrice, $lte: req.body.maxPrice } }] })
  }
  if (req.body.beginTime && req.body.endTime) {
    params.push({ $or: [{ beginTime: { $gte: req.body.beginTime } }] })
    params.push({ $or: [{ endTime: { $lte: req.body.endTime } }] })
  }
  if (req.body.code) {
    cityCode.push({
      city: req.body.code
    })
  }
  if (cityCode.length) {
    params.push({
      $or: cityCode
    })
  }
  // 超级管理员可以查询全部房源，个人只能查询个人的房源
  if (req.session.userId && (req.session.userId.toString() !== global.adminId.toString())) {
    params.push({
      $or: [{ userId: req.session.userId }]
    })
  }

  // let filter = {
  //   // $and: [
  //   //   {
  //   //     $or: [
  //   //       { province: req.body.code },
  //   //       { city: req.body.code },
  //   //       { region: req.body.code }
  //   //     ]
  //   //   },
  //   //   { $or: [{ lease: req.body.lease }] },
  //   //   { $or: [{ bedType: req.body.bedType }] },
  //   //   { $or: [{ houseType: req.body.houseType }] },
  //   //   { $or: [{ toilet: req.body.toilet }] },
  //   //   { $or: [{ price: { $gte: req.body.minPrice, $lte: req.body.maxPrice } }] },
  //   //   { $or: [{ peoples: { $lte: req.body.peoples } }] },
  //   //   { $or: [{ beginTime: { $gte: req.body.beginTime } }] },
  //   //   { $or: [{ endTime: { $lte: req.body.endTime } }] },
  //   // ]
  // }

  if (params.length) {
    filter = {
      $and: params
    }
  }
  console.log('列表筛选条件---------------')
  console.log(JSON.stringify(filter));

  // 查询符合条件的总条数
  HouseSchema.count(filter, (err, docs) => {
    console.log(err);
    if (err) res.status(500)
    else {
      total = docs
    }
  })

  // 多条件查询
  HouseSchema
    .find(filter)
    .limit(limit + skip)
    .skip(skip)
    .sort(sort)
    .exec((err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500)
      }
      console.log('查询房源列表结果 ------------- ')
      console.log(doc)
      let data = JSON.parse(JSON.stringify(doc))
      data = data.map(item => {
        item['houseId'] = item._id
        delete item._id
        delete item.details
        delete item.notes
        delete item.configure
        return item
      })
      res.send({
        code: 0,
        data,
        total: total,
        pageSize: pageSize,
        pageNo: pageNo
      })
    })
})

/**
 * 房源详情
 * @param {String} houseId must
 */
router.get('/houseDetail', (req, res) => {
  const fields = ['houseId'];
  if (Valid.compareField(fields, req.query, res)) return;

  // console.log(req.query.houseId)
  const id = mongoose.Types.ObjectId(req.query.houseId)
  HouseModel
    .findOne({ _id: id })
    .then(({ code, data }) => {
      if (code === 0) {
        let result = JSON.parse(JSON.stringify(data))
        result['houseId'] = data._id
        delete result._id
        UserModel
          .findOne({ _id: mongoose.Types.ObjectId(result.userId) })
          .then((doc) => {
            console.log(doc)
            result.user = {
              name: doc.data.name,
              avatarUrl: doc.data.avatarUrl,
              phone: doc.data.phone
            }
            delete result.userId
            res.send({
              code: doc.status,
              data: result
            })
          })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500)
    })
})

/**
 * 删除房源
 * @param {String} houseId must
 */
router.post('/deleteHouse', (req, res) => {

  if (Auth.keepConversation(req, res)) return;

  const fields = ['houseId'];
  if (Valid.compareField(fields, req.body, res)) return;

  const _id = mongoose.Types.ObjectId(req.body.houseId);
  HouseModel
    .deleteOne({ _id })
    .then(result => {
      console.log('删除房源结果 ------------ ')
      console.log(result)
      if (result.code === 0) {
        if (result.data) {
          res.send({
            code: 0,
            msg: '删除成功'
          })
        } else {
          res.status(500)
        }
      } else {
        res.status(500)
      }
    })
})

/**
 * 删除房源图片
 * @param {String} url must 图片链接
 */
router.post('/deleteHousePicture', (req, res) => {
  if (Auth.keepConversation(req, res)) return;

  const fields = ['url'];
  if (Valid.compareField(fields, req, res)) return;

  fs.unlink(path.resolve(__dirname, `../public${req.body.url.substring(API.length, )}`), err => {
    console.log(err);
    if (err) {
      res.status(500)
    }
    res.send({
      code: 0,
      data: null,
      msg: '删除成功'
    })
  })
})

/**
 * 添加评论
 * @param {String} houseId 房屋Id must
 * @param {String} avatarUrl 用户头像 must
 * @param {String} name 微信昵称 must
 * @param {String} content 评论内容 must
 * @param {Number} score 评分 must
 */
router.post('/addEvaluate', (req, res) => {
  const fields = ['houseId', 'avatarUrl', 'name', 'content', 'score'];
  if (Valid.compareField(fields, req.body, res)) return;

  const body = req.body;
  body.createTime = new Date().getTime();
  Evaluate
    .create(body)
    .then(result => {
      console.log('添加评论 返回值------------------');
      console.log(result);
      if (result.code === 0 && result.data) {
        res.send({
          code: 0,
          data: null,
          msg: '添加评论成功'
        })
        updateHouseScore(req.body.houseId)
      } else {
        res.send({
          code: -1,
          data: null,
          msg: '添加评论失败'
        })
      }
    })
})

/**
 * 根据房源评论 更新房源评分
 */
const updateHouseScore = (houseId) => {

  // 先查找所有的评论
  Evaluate
    .find({ houseId: houseId })
    .then(res => {
      if (res.code === 0) {
        let sum = 0;
        if (res.data.length) {
          for (let item of res.data) {
            sum += Number(item.score)
          }
          // 计算所有评分 取平均值
          const average = (sum / res.data.length).toFixed(1).toString();
          // 更新房源的评分和评论数
          HouseModel
            .findByIdAndUpdate(mongoose.Types.ObjectId(houseId), { score: average, evaluate: res.data.length.toString() }, { new: true })
            .then(result => {
              if (result.code === 0) {
                console.log('更新房源信息成功');
              } else {
                console.log('更新房源信息未成功');
              }
            })
        }
      }
    })
}

/**
 * 根据房屋Id获取评论列表
 * @param {String} houseId must
 */
router.get('/evaluate', (req, res) => {
  const fields = ['houseId'];
  if (Valid.compareField(fields, req.query, res)) return;

  console.log(req.query)
  Evaluate
    .find({ houseId: req.query.houseId })
    .then(result => {
      console.log('获取用户列表 ------------------')
      console.log(result)
      let list = []
      if (result.code === 0 && result.data.length) {
        list = result.data.map(item => {
          const cell = JSON.parse(JSON.stringify(item));
          cell.id = cell._id;
          delete cell._id;
          delete cell.score;
          return cell;
        })
        res.send({
          code: 0,
          data: list
        })
      } else {
        res.send({
          code: 0,
          data: list
        })
      }
    })
})

module.exports = router;