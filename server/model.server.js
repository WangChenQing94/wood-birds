
/**
 * 
 * @param {Object} model 模型
 * @param {String} methods 方法
 * @param {Any} args 参数
 */
const create = (model, args = {}) => {
  return new Promise((resolve, reject) => {
    args.createTime = new Date().getTime();
    model.create(args, (err, docs) => {
      if (err) reject(err);
      resolve({
        code: 0,
        data: docs
      })
    })
  })
}

/**
 * 查询
 * @param {Object} model 模型
 * @param {String} methods 方法
 * @param {Any} args 参数
 */
const find = (model, args = {}) => {
  return new Promise((resolve, reject) => {
    model.find(args, (err, docs) => {
      if (err) reject(err);
      console.log('find :: docs --->')
      console.log(docs)
      resolve({
        code: 0,
        data: docs
      })
    })
  })
}

/**
 * 查询一条数据
 * @param {Object} model 模型
 * @param {String} methods 方法
 * @param {Any} args 参数
 * @param {String} fields 字段
 */
const findOne = (model, args = {}, fields = null) => {
  return new Promise((resolve, reject) => {
    model.findOne(args, fields, (err, docs) => {
      if (err) reject(err);
      console.log('findOne :: docs --->')
      console.log(docs)
      resolve({
        code: 0,
        data: docs
      })
    })
  })
}

/**
 * 根据ID更新数据
 */
const findByIdAndUpdate = (model, id = null, args = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(id, args, options, (err, docs) => {
      if (err) reject(err);
      console.log('findByIdAndUpdate docs ------------------');
      console.log(docs);
      resolve({
        code: 0,
        data: docs
      })
    })
  })
}

/**
 * 删除符合条件的第一个文档
 */
const deleteOne = (model, args) => {
  return new Promise((resolve, reject) => {
    model.deleteOne(args, (err, docs) => {
      console.log('DeleteOne ----------------- ');
      console.log(err);
      console.log(docs);
      if (err) reject(err);
      resolve({
        code: 0,
        data: docs
      })
    })
  })
}


/**
 * 删除符合条件的所有文档
 */

module.exports = {
  create,
  find,
  findOne,
  findByIdAndUpdate,
  deleteOne
}