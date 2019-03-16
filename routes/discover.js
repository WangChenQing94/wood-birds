const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const multiparty = require('multiparty');
const mongoose = require('mongoose');

const upload = multer({ dest: 'public/images/article/' });

const ArticleModel = require('../model/article');
const ArticleSchema = require('../schemas/Article');

const Valid = require('../server/valid');
const Auth = require('../server/auth');
/**
 * 获取精选的文章列表
 * @param {Number} pageNo 页码 must
 * @param {Number} pageSize 页数 must
 */
router.get('/wonderful', (req, res, next) => {
  const fields = ['pageSize', 'pageNo'];
  if (Valid.compareField(fields, req.query, res)) return;

  const pageSize = req.query.pageSize && Number(req.query.pageSize);
  const pageNo = req.query.pageNo && Number(req.query.pageNo);
  const limit = pageSize || 0;
  const skip = (pageSize && pageNo) ? pageSize * (pageNo - 1) : 0;

  ArticleSchema
    .find()
    .limit(limit)
    .skip(skip)
    .exec((err, docs) => {
      console.log(err);
      console.log(docs);
      // let data = JSON.parse(JSON.stringify(docs));
      const data = docs.map(item => {
        // const newObj = Object.assign({}, item);
        // newObj.id = item._id;
        // delete newObj._id
        // return newObj;
        return {
          id: item._id,
          content: item.content,
          title: item.title,
          createTime: item.createTime,
          bannerUrl: item.bannerUrl || ''
        };
      })
      res.send({
        code: 0,
        data
      })
    })
})

/**
 * 查看文章详情
 * @param {String} id must
 */
router.get('/articleDetail', (req, res, next) => {
  const fields = ['id']
  if (Valid.compareField(fields, res.query, res)) return;

  const _id = mongoose.Types.ObjectId(req.query.id);
  ArticleModel
    .findOne({ _id })
    .then(result => {
      console.log('查询文章详情 结果 --------------------')
      console.log(result.data)
      if (result.code === 0 && result.data) {
        const data = JSON.parse(JSON.stringify(result.data));
        delete data._id;
        res.send({
          code: 0,
          data
        })
      }
    })
})

/**
 * 添加精选的文章
 * @param {String} title 文章标题 must
 * @param {String} content 文章内容 must
 */
router.post('/addWonderful', (req, res, netx) => {
  const fields = ['title', 'content'];
  if (Valid.compareField(fields, req.body, res)) return;

  const body = req.body;
  body.createTime = new Date().getTime();
  ArticleModel
    .create(body)
    .then(result => {
      console.log('添加文章的返回值 ---------------');
      console.log(result);
      if (result.code === 0 && result.data) {
        res.send({
          code: 0,
          data: null,
          msg: '添加文章成功'
        })
      } else {
        res.send({
          code: 0,
          data: null,
          msg: '添加文章失败'
        })
      }
    })
})

router.post('/delWonderful', (req, res) => {
  const fields = ['id'];
  if (Valid.compareField(fields, req.body, res)) return;

  if (Auth.keepConversation(req, res)) return;

  ArticleModel
    .deleteOne({ _id: mongoose.Types.ObjectId(req.body.id) })
    .then(result => {
      console.log(result);
      if (result.code === 0) {
        res.send({
          code: 0,
          data: null,
          msg: '删除文章成功'
        })
      } else {
        res.send({
          code: -1,
          data: null,
          msg: '删除文章失败'
        })
      }
    })
})

/**
 * 上传文章封面图片
 * @param {file} file 图片文件
 */
router.post('/uploadBanner', upload.single('file'), (req, res, next) => {
  // if (Auth.keepConversation(req, res)) return;

  if (req.file !== {}) {
    const file = req.file;
    const splits = file.originalname.split('.');
    const extname = splits[splits.length - 1];
    fs.renameSync(path.resolve(__dirname, `../public/images/article/${file.filename}`), path.resolve(__dirname, `../public/images/article/${file.filename}.${extname}`));

    res.send({
      code: 0,
      data: {
        url: `${API}/images/article/${file.filename}.${extname}`
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

// const ueConfJson = require('../public/UE/ueditor.config.json');
router.get('/uploadImage', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/json' });
  res.write(JSON.stringify({}));
  res.end();
})

//  上传文章图片
router.post('/uploadImage', (req, res) => {
  console.log(req.body);
  const form = new multiparty.Form();

  form.encoding = 'utf-8';
  form.uploadDir = path.resolve(__dirname, '../public/images/article/');

  console.log(req.query)
  console.log(req.files)

  form.parse(req, (err, fields, files) => {
    console.log(files);
    const file = files.file[0];
    console.log(file);
    console.log(file.path.substr(file.path.indexOf('article') + 8));
    const filename = file.path.substr(file.path.indexOf('article') + 8);
    res.send({
      "originalName": filename.split('.')[0],
      "name": filename.split('.')[0],
      "url": API + `/images/article/${filename}`,
      "type": filename.split('.')[1],
      "size": file.size,
      "state": "SUCCESS"
    });
    res.end();
  })
})

module.exports = router;