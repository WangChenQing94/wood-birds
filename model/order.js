/**
 * 订单模块
 */

const modelServer = require('../server/model.server');
const Order = require('../schemas/Order');

/**
 * 创建
 */
const create = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .create(Order, args)
      .then(res => {
        console.log(res)
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

/**
 * 查询
 */
const find = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .find(Order, args)
      .then(({ code, data }) => {
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

/**
 * 查询一条
 */
const findOne = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .findOne(Order, args)
      .then(({ code, data }) => {
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

/**
 * 更新信息
 */
const findByIdAndUpdate = (id, args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .findByIdAndUpdate(Order, id, args)
      .then(({ code, data }) => {
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  create,
  find,
  findOne,
  findByIdAndUpdate
}