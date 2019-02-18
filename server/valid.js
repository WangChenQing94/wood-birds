/**
 * 校验必传字段
 */

class Valid {
  /**
   * 
   * @param {Array} fields 必穿字段集合
   * @param {Object} data 接口响应的字段集合
   * @param {Object} res 路由的响应方法
   * 
   * 验证失败 true
   * 验证通过 false
   */
  compareField(fields = [], data = {}, res = {}) {
    let err = ''
    for (let key of fields) {
      if (!data[key]) err += `${key} `;
    }
    if (err.length) {
      res.send({
        code: -1,
        data: null,
        msg: `缺少字段 ${err}`
      })
      return true;
    } else {
      return false
    }
  }
}


module.exports = new Valid();