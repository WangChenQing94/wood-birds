/**
 * 处理homes表的模型
 */
const fs = require('fs')
const path = require('path')
const modelServer = require('../server/model.server')
const Home = require('../schemas/Home')
const HotCityModel = require('./hotCity')

const model = new Home()

/**
 * 创建
 */
const create = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .create(Home, args)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

/**
 * 查询
 */
const find = (args) => {
  return new Promise((resolve, reject) => {
    modelServer
      .find(Home, args)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

/**
 * 根据字段查询
 */
const findOne = (args, fields) => {
  return new Promise((resolve, reject) => {
    modelServer
      .findOne(Home, args, fields)
      .then(({ code, data }) => {
        let _docs = JSON.parse(JSON.stringify(data)) || {}
        // if (_docs) {
        //   _docs.hotCitys = _docs.hotCitys && _docs.hotCitys.map(item => {
        //     item.url = API + item.url
        //     return item
        //   })
        // }
        // 读取banner文件夹
        // fs.readdir(path.resolve('./public/images/home/banner'), (err, data) => {
        //   console.log('fs ----------------->')
        //   console.log(data)
        //   if (err) reject(err)
        //   _docs['banners'] = data.map(item => {
        //     return API + item
        //   })
        //   // 获取热门城市
        //   HotCityModel
        //     .find()
        //     .then(res => {
        //       console.log('HotCityModel ---------- >')
        //       const _citys = res.data
        //       console.log(_citys)
        //       _docs['hotCitys'] = _citys.map(item => {
        //         item.url = API + item.url
        //         return item
        //       })
        //       resolve({
        //         code: code,
        //         data: _docs
        //       })
        //     }).catch(err => reject(err))
        // })
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  create,
  find,
  findOne
}

