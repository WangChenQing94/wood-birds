/**
 * 评价
 */
const modelServer = require('../server/model.server');
const Evaluate = require('../schemas/Evaluate');

/**
 * 创建
 */
const create = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .create(Evaluate, args)
      .then(res => {
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
      .find(Evaluate, args)
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  create,
  find
}