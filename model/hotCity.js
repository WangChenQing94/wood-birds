/**
 * 处理hotCitys表的模型
 */
const modelServer = require('../server/model.server')
const HotCity = require('../schemas/HotCity')

/**
 * 创建
 */
const create = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .create(HotCity, args)
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
      .find(HotCity, args)
      .then(({ code, data }) => {
        let _docs = JSON.parse(JSON.stringify(data)) || {}
        if (_docs) {
          _docs = _docs.filter(item => {
            delete item._id
            return true
          })
        }
        resolve({
          code: code,
          data: _docs
        })
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  create,
  find
}