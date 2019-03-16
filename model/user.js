/**
 * 用户
 */

const modelServer = require('../server/model.server');
const User = require('../schemas/User');

/**
 * 查询
 */
const find = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .find(User, args)
      .then(({ code, data }) => {
        resolve({ code, data });
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
      .findOne(User, args)
      .then(({ code, data }) => {
        resolve({ code, data });
      })
      .catch(err => reject(err))
  })
}

/**
 * 更新信息
 */
const findByIdAndUpdate = (id, args, options) => {
  return new Promise((resolve, reject) => {
    modelServer
      .findByIdAndUpdate(User, id, args, options)
      .then(({ code, data }) => {
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

/**
 * 注册用户
 */
const register = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .create(User, args)
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  })
}

module.exports = {
  find,
  findOne,
  register,
  findByIdAndUpdate
}