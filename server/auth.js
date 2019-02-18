/**
 * 验证权限
 */

const mongoose = require('mongoose');
const UserModel = require('../model/user');

class Auth {

  /**
   * 保持会话
   * @param {Object} req 返回值
   * @param {Object} res 响应值
   */
  keepConversation(req, res) {
    console.log(req.session);
    if (!req.session.userId) {
      res.send({
        code: 4,
        data: null,
        msg: '登陆超时'
      })
      return true
    }

    req.session.userId = req.session.userId;
    return false;
  }

  // 是否是超级管理员
  isAdmin(req, res) {
    if (res.session.userId === global.adminId) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = new Auth();