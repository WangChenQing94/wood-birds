/**
 * 文章
 */

const modelServer = require('../server/model.server');
const Article = require('../schemas/Article');

/**
 * 创建
 */
const create = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .create(Article, args)
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
      .find(Article, args)
      .then(res => {
        resolve(res)
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
      .findOne(Article, args)
      .then(res => {
        resolve(res)
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  create,
  find,
  findOne
}