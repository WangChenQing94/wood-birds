/**
 * 订单模块
 */
const router = require('express').Router();
const mongoose = require('mongoose');

const OrderModal = require('../model/order');
const OrderSchema = require('../schemas/Order');

const Valid = require('../server/valid');

/**
 * 生成订单
 * @param {String} houseId 房源Id must
 * @param {String} userId 用户Id must
 * @param {Number} beginTime 入住日期 must
 * @param {Number} endTime 离开日期 must
 * @param {String} name 房客姓名 option
 * @param {String} phone 手机号 must
 * @param {Number} totalPrice 总价 must
 */
router.post('/generateOrder', (req, res) => {
  console.log(req)
  const fields = ['houseId', 'userId', 'beginTime', 'endTime', 'phone', 'totalPrice'];
  if (Valid.compareField(fields, req.body, res)) return;

  const doc = req.body;
  doc.houseId = mongoose.Types.ObjectId(doc.houseId);
  doc.payStatus = false;
  OrderModal
    .create(doc)
    .then(({ code, data }) => {
      console.log('生成订单结果 ------------- ');
      console.log(code);
      if (code === 0) {
        if (data !== {}) {
          res.send({
            code: 0,
            data: {
              orderId: data._id
            },
            msg: '预约成功'
          })
        } else {
          res.send({
            code: 1,
            data: null,
            msg: '未知错误'
          })
        }
      } else {
        res.status(500)
      }
    })
})

/**
 * 订单确认支付
 * @param {String} orderId 订单号(Id) must
 * @param {Number} totalPrice 价格 must
 */
router.post('/confirmPayment', (req, res) => {
  const fields = ['orderId', 'totalPrice'];
  if (Valid.compareField(fields, req.body, res)) return;

  const _id = mongoose.Types.ObjectId(req.body.orderId);
  OrderModal
    .findOne({ _id })
    .then(({ code, data }) => {
      console.log('查询订单结果 ---- ')
      console.log(data)
      if (code === 0) {
        if (data !== {}) {
          if (data.totalPrice === Number(req.body.totalPrice)) {
            OrderModal
              .findByIdAndUpdate(_id, { payStatus: true })
              .then(result => {
                console.log('更新订单状态 结果 -------------')
                console.log(result);
                if (result.code === 0 && result.data) {
                  res.send({
                    code: 0,
                    data: null,
                    msg: '支付成功'
                  })
                } else {
                  res.status(500);
                }
              })
          } else {
            res.send({
              code: 0,
              data: null,
              msg: '支付金额错误，支付失败'
            })
          }
        } else {
          res.send({
            code: 1,
            data: null,
            msg: '未知错误'
          })
        }
      } else {
        res.status(500)
      }
    })
})

/**
 * 订单列表
 * @param {Number} status 0 进行中; 1 已结束; 2 全部 must
 * @param {String} userId 用户Id must
 * @param {Number} pageSize 页数 must
 * @param {Number} pageNo 页码 must
 */
router.post('/getOrderList', (req, res) => {
  const fields = ['status', 'userId', 'pageSize', 'pageNo'];
  if (Valid.compareField(fields, req.body, res)) return;

  let { status, userId, pageSize, pageNo } = req.body;
  pageSize = pageSize && Number(pageSize);
  pageNo = pageNo && Number(pageNo);
  const limit = pageSize || 0;
  const skip = (pageSize && pageNo) ? pageSize * (pageNo - 1) : 0

  let total = 0;
  OrderSchema.count({
    userId,
    payStatus: true
  }, (err, count) => {
    console.log(err)
    console.log(count);
    if (err) {
      res.send(500)
      return
    }
    total = count;
  })

  const filter = {
    $and: [
      { $and: [{ userId }] }
    ]
  }
  const currentTime = new Date().getTime();
  if (Number(status) === 0) {
    filter['$and'].push({
      $and: [{ endTime: { $lte: currentTime } }],
      $and: [{ payStatus: true }]
    })
  } else if (Number(status) === 1) {
    filter['$and'].push({
      $and: [{ endTime: { $gte: currentTime } }],
      $and: [{ payStatus: true }]
    })
  }

  OrderSchema
    .aggregate([
      {
        $lookup: {
          from: 'houses',
          localField: 'houseId',
          foreignField: '_id',
          as: 'houses'
        }
      },
      {
        $unwind: {
          path: '$houses',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: filter
      },
      {
        $project: {
          name: 1,
          userId: 1,
          beginTime: 1,
          endTime: 1,
          phone: 1,
          totalPrice: 1,
          payStatus: 1,
          houses: {
            name: 1,
            province: 1,
            city: 1,
            region: 1,
            addrDetail: 1
          }
        }
      }
    ])
    .limit(limit)
    .skip(skip)
    .then(doc => {
      console.log('多表关联查询 结果---------------')
      console.log(doc)
      res.send({
        code: 0,
        data: doc,
        total,
        pageSize,
        pageNo
      })
    })

  // OrderSchema
  //   .find(filter)
  //   .limit(limit)
  //   .skip(skip)
  //   .exec((err, docs) => {
  //     console.log(err)
  //     console.log(docs)
  //     if (!err) {
  //       let data = JSON.parse(JSON.stringify(docs));
  //       data = data.map(item => {
  //         delete item._id;
  //         delete item.userId;
  //         return item;
  //       })
  //       res.send({
  //         code: 0,
  //         data,
  //         total: total,
  //         pageSize,
  //         pageNo
  //       })
  //     } else {
  //       res.status(500)
  //     }
  //   })
})

module.exports = router;