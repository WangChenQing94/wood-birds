const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

class token {
  constructor(data) {
    this.data = data;
  }

  // 生成token
  generateToken () {}
}

module.exports = token