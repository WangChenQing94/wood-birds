
const ModelServer = require('../server/model.server')
const House = require('../schemas/House')
// const model = new House()


/**
 * 添加房源
 */
const create = (args) => {
  return new Promise((resolve, reject) => {
    ModelServer
      .create(House, args)
      .then(res => {
        console.log(res)
        resolve(res);
      })
      .catch(err => reject(err));
  })
}

/**
 * 查询房源
 */
const find = (args) => {
  return new Promise((resolve, reject) => {
    ModelServer
      .find(House, args)
      .then(({ code, data }) => {
        console.log(code)
        console.log(data)
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

/**
 * 查找一个
 */
const findOne = (args) => {
  return new Promise((resolve, reject) => {
    ModelServer
      .findOne(House, args)
      .then(({ code, data }) => {
        console.log(code)
        console.log(data)
        resolve({ code, data })
      })
      .catch(err => reject(err))
  })
}

/**
 * 更新信息
 */
const findByIdAndUpdate = (id, args, options) => {
  return new Promise((resolve, reject) => {
    ModelServer
      .findByIdAndUpdate(House, id, args, options)
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
    ModelServer
      .deleteOne(House, args)
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
  findByIdAndUpdate,
  deleteOne
}