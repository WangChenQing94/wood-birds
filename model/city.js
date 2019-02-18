/**
 * 搜索地区
 */

const modelServer = require('../server/model.server');
const City = require('../schemas/City');

/**
 * 创建
 */
const create = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .create(City, args)
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
      .find(City, args)
      .then(({ code, data }) => {
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

/**
 * 删除符合条件的第一个文档
 */
const deleteOne = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .deleteOne(City, args)
      .then(({ code, data }) => {
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

/**
 * 更新信息
 */
const findByIdAndUpdate = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .findByIdAndUpdate(City, args)
      .then(({ code, data }) => {
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  create,
  find,
  deleteOne,
  findByIdAndUpdate
}