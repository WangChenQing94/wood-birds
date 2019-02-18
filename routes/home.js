
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'public/images/home/' });
const bannerPath = multer({ dest: 'public/images/home/banner' });

const router = require('express').Router();

// const HotCityModel = require('../model/hotCity');
const CityModel = require('../model/city');
const CitySchema = require('../schemas/City');

const Valid = require('../server/valid');
const Auth = require('../server/auth');

/**
 * 返回热门城市和Banner
 */
router.get('/home', (req, res) => {
  // 返回banner,热门城市
  const _docs = {}
  fs.readdir(path.resolve(__dirname, '../public/images/home/banner'), (err, data) => {
    console.log('fs ----------------->')
    console.log(data)
    if (err) {
      console.error(err)
      return res.status(500)
    }
    _docs['banners'] = data.map(item => {
      return API + '/images/home/banner/' + item
    })
    // 获取热门城市
    CitySchema
      .find({ isHot: true })
      .then(result => {
        console.log('HotCityModel ---------- >')
        const _citys = result.data || [];
        console.log(_citys)
        _docs['hotCitys'] = _citys.map(item => {
          item.url = API + item.url
          return item
        })
        res.send({
          code: 0,
          data: _docs
        })
      }).catch(err => {
        res.status(500)
      })
  })
})

/**
 * 上传banner图片
 */
router.post('/uploadBanner', bannerPath.single('file'), (req, res) => {
  if (Auth.keepConversation(req, res)) return;

  console.log('上传banner图片 --------------- ')
  console.log(req.file);
  if (req.file !== {}) {
    const file = req.file;
    const splits = file.originalname.split('.');
    const extname = splits[splits.length - 1];

    const result = fs.renameSync(path.resolve(__dirname, `../public/images/home/banner/${file.filename}`), path.resolve(__dirname, `../public/images/home/banner/${file.filename}.${extname}`));

    console.log(result);
    res.send({
      code: 0,
      data: `${API}/images/home/banner/${file.filename}.${extname}`,
      msg: '上传成功'
    })
  }
})

/**
 * 删除Banner图片
 * @param {String} url 图片路径
 */
router.post('/delBanner', (req, res) => {
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
 * 上传城市图片
 * @param {file} file
 */
router.post('/uploadCityPicture', upload.single('file'), (req, res, next) => {
  console.log(req.file)
  console.log(req.body)
  if (Auth.keepConversation(req, res)) return;

  if (req.file !== {}) {
    const file = req.file;
    const splits = file.originalname.split('.');
    const extname = splits[splits.length - 1];
    fs.renameSync(path.resolve(__dirname, `../public/images/home/${file.filename}`), path.resolve(__dirname, `../public/images/home/${file.filename}.${extname}`));

    res.send({
      code: 0,
      data: {
        url: `${API}/images/home/${file.filename}.${extname}`
      }
    })
  } else {
    res.send({
      code: 1,
      data: null,
      msg: '请上传图片'
    })
  }
})

/**
 * 添加城市编码
 * @param {Boolean} isHot 是否是热门城市 option
 * @param {String} url 热门城市的图片 option 
 * @param {String} code 城市编码 must
 * @param {Number} parentCode 父级的编码 must
 * @param {String} name 城市名称
 */
router.post('/addCity', (req, res) => {
  const fields = ['code', 'parentCode', 'name'];
  if (Valid.compareField(fields, req.body, res)) return;
  if (Auth.keepConversation(req, res)) return;

  if (req.body.isHot) {
    if (req.body.url) {
      res.send({
        code: 1,
        data: null,
        msg: '缺少字段 url'
      })
    } else {
      req.body.url = req.body.url.substring(API.length);
    }
  }

  CityModel
    .find({ code: req.body.code })
    .then(({ code, data }) => {
      console.log('查詢城市結果 --------------- ')
      console.log(code)
      console.log(data)
      if (code === 0 && !data.length) {
        CityModel
          .create(req.body)
          .then(result => {
            console.log(result)
            if (result.code === 0 && result.data) {
              res.send({
                code: 0,
                data: null,
                msg: '添加成功'
              })
            } else {
              res.send({
                code: -1,
                data: null,
                msg: '服务器错误'
              })
            }
          })
      } else {
        res.send({
          code: 1,
          data: null,
          msg: '该城市已存在'
        })
      }
    })
})

/**
 * 删除热门城市图片
 * @param {String} url 图片路径
 */
router.post('/delCityPicture', (req, res) => {
  if (Auth.keepConversation(req, res)) return;

  const fields = ['url'];
  if (Valid.compareField(fields, req, res)) return;

  const _id = mongoose.Types.ObjectId(req.session.userId);
  fs.unlink(path.resolve(__dirname, `../public${req.body.url.substring(API.length)}`), err => {
    if (err) {
      res.status(500)
    }
    CityModel
      .findByIdAndUpdate(_id, { url: '' })
      .then(result => {
        console.log('删除图片的返回值 ---------------');
        console.log(result);
        if (result.code === 0) {
          res.send({
            code: 0,
            data: null,
            msg: '图片删除成功'
          })
        } else {
          res.status(500)
        }
      })
  })
})

/**
 * 获取城市列表
 * @param {Number} pageSize must 页数
 * @param {Number} pageNo must 页码
 */
router.get('/getCityList', (req, res, next) => {
  const fields = ['pageSize', 'pageNo'];
  if (Valid.compareField(fields, req.query, res)) return;

  const pageSize = req.query.pageSize && Number(req.query.pageSize);
  const pageNo = req.query.pageNo && Number(req.query.pageNo);
  const limit = pageSize || 0;
  const skip = (pageSize && pageNo) ? pageSize * (pageNo - 1) : 0;

  let total = 0;

  CitySchema.count({}, (err, count) => {
    if (err) res.status(500)
    total = count;
  })

  CitySchema
    .find({})
    .limit(limit)
    .skip(skip)
    .exec((err, docs) => {
      console.log(docs)
      let data = JSON.parse(JSON.stringify(docs));
      if (docs.length) {
        data = data.map(item => {
          item.id = item._id;
          delete item._id;
          return item;
        })
      }
      res.send({
        code: 0,
        data,
        total,
        pageNo,
        pageSize
      })
    })
})

/**
 * 删除城市
 * @param {String} code 城市编码 must
 */
router.post('/deleteCity', (req, res) => {
  const fields = ['code'];
  if (Valid.compareField(fields, req.body, res)) return;
  if (Auth.keepConversation(req, res)) return;

  CityModel
    .deleteOne({ code: req.body.code })
    .then(result => {
      if (result.code === 0 && result.data) {
        res.send({
          code: 0,
          msg: '城市删除成功'
        })
      } else {
        res.status(500)
      }
    })
})

module.exports = router