const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


router.all('*', (req, res, next) => {

  res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // 项目上线后改成页面的地址

  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

  res.header('Access-Control-Allow-Credentials', 'true');

  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  
  next();
})

/* GET home page. */
router.get('/', function (req, res, next) {

  fs.unlink(path.resolve(__dirname, '../public/images/home/66219f16f2bbb92e9b48e320e4653099.jpg'), err => {
    if (err) throw err;
    console.log('文件已删除');
  })

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
      <title>Wood Birds</title>
    </head>
    <body>
      <h1>Wood Birds Back End</h1>
    </body>
    </html>
  `)
});

/**
 * 路由
 */
const Home = require('./home');
const Resource = require('./resource');
const Account = require('./account');
const Discover = require('./discover');
const Order = require('./order');

router.use(Home);
router.use('/resource', Resource);
router.use('/account', Account);
router.use('/discover', Discover);
router.use('/order', Order);

module.exports = router;
