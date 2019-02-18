/**
 * 账户类的操作
 */
const router = require('express').Router();
const request = require('request');

const UserModel = require('../model/user');
const UserSchema = require('../schemas/User');

const Valid = require('../server/valid');
const Auth = require('../server/auth');
/**
 * 小程序登录
 * @param {String} name 用户昵称 must
 * @param {String} code 微信登录Code must
 * @param {String} avatarUrl 用户头像 must
 * @param {String} phone 手机号 must
 * @param {String} password 密码 (加密规则 -> 手机号 加上 密码的加密，然后整个加密) must
 */
router.post('/wxLogin', (req, res, next) => {
  console.log('登录 获取参数 -------------- ');
  console.log(req.body);

  const fields = ['name', 'code', 'avatarUrl', 'phone', 'password'];
  if (Valid.compareField(fields, req.body, res)) return;

  const body = req.body;
  request.get({
    url: wx.code2session,
    json: true,
    qs: {
      appid: wx.appId,
      secret: wx.secret,
      js_code: body.code,
      grant_type: 'authorization_code'
    }
  }, (err, response, result) => {
    console.log('获取登录凭证 -------------- ')
    console.log(result);
    if (result.openid) {
      // 查询用户表是否存在用户
      UserModel
        .findOne({ openId: result.openid })
        .then(({ code, data }) => {
          console.log('用户表 查询结果 ------------------ ')
          console.log(code)
          console.log(data)
          if (code === 0) {
            if (!data) {
              // 用户表中不存在该用户，该用户信息插入到用户表
              UserModel
                .register({
                  name: body.name,
                  avatarUrl: body.avatarUrl,
                  openId: result.openid,
                  phone: body.phone,
                  password: body.password
                })
                .then(doc => {
                  console.log('用户注册 结果 ------------------- ')
                  console.log(doc)
                  if (doc.code === 0) {
                    res.send({
                      code: 0,
                      data: { userId: doc.data._id },
                      msg: '登录成功'
                    })
                  } else {
                    res.status(500);
                  }
                })
            } else {
              res.send({
                code: 0,
                data: { userId: data._id },
                msg: '登录成功'
              })
            }
          } else {
            res.status(500)
          }
        })
    } else {
      res.send({
        code: 1,
        data: null,
        msg: result.errmsg
      })
    }
  })
})

/**
 * 后台登录
 * @param {String} phone 手机号 must
 * @param {String} password 密码 must
 */
router.post('/login', (req, res) => {
  const mustFields = ['phone', 'password'];
  if (Valid.compareField(mustFields, req.body, res)) return;

  const { phone, password } = req.body;
  UserModel
    .findOne({ phone })
    .then(result => {
      console.log('查询用户表结果-------------')
      console.log(result);
      if (result.code === 0) {
        if (result.data) {
          if (result.data.password === password) {
            const { _id, name, avatarUrl } = result.data;
            req.session.userId = _id;
            // 是否是超级管理员
            if (phone === 'admin') {
              global.adminId = _id;
            }
            console.log(req.session);
            res.send({
              code: 0,
              data: {
                name: name,
                avatarUrl: phone === 'admin' ? `${global.API}/${avatarUrl}` : avatarUrl,
                isAdmin: phone === 'admin' ? true : false
              },
              msg: '登录成功'
            })
          } else {
            res.send({
              code: 1,
              data: null,
              msg: '用户名密码错误'
            })
          }
        } else {
          res.send({
            code: 0,
            data: null,
            msg: '该用户不存在'
          })
        }
      } else {
        res.status(500)
      }
    })
})

/**
 * 后台退出登录
 */
router.post('/logout', (req, res) => {
  if (Auth.keepConversation(req, res)) return;

  req.session.userId = null;
  res.send({
    code: 0,
    data: null,
    msg: '退出登录'
  })
})

/**
 * 获取用户列表
 * @param {Number} pageNo 页码 must
 * @param {Number} pageSize 页数 must
 */
router.get('/getUserList', (req, res) => {

  console.log('获取用户列表 --------- ')
  console.log(req.session);
  // 是否登陆
  if (Auth.keepConversation(req, res)) return;

  // 所传字段是否正确
  const fields = ['pageSize', 'pageNo'];
  if (Valid.compareField(fields, req.query, res)) return;

  const pageSize = req.query.pageSize && Number(req.query.pageSize);
  const pageNo = req.query.pageNo && Number(req.query.pageNo);
  const limit = pageSize || 0;
  const skip = (pageSize && pageNo) ? pageSize * (pageNo - 1) : 0;
  let total = 0;

  UserSchema.count({}, (err, count) => {
    console.log('获取全部数量-------------')
    total = count
  })

  UserSchema
    .find()
    .limit(limit)
    .skip(skip)
    .exec((err, docs) => {
      console.log(docs);
      if (err) {
        res.status(500);
        return
      }
      let data = JSON.parse(JSON.stringify(docs));
      data = data.map(item => {
        item.id = item._id;
        delete item._id;
        delete item.openId;
        return item;
      })
      res.send({
        code: 0,
        data,
        total,
        msg: ''
      })
    })
})

/**
 * 优惠券
 * @param(type) 0 可使用; 1 已过期
 */
router.post('/coupon', (req, res, next) => {
  res.send({
    code: 0,
    data: {},
    msg: '优惠券'
  })
})

module.exports = router;