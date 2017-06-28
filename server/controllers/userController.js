const User = require('../models/userModel');

let output = function (status, data, info) {
  return JSON.stringify({
    status: status,
    data: data,
    info: info
  });
};

let userController = {
  handleUserList(req, res) {
    console.log('run to here');
    User.find((err, users) => {
      if (err) {
        console.log(err);
      }
      res.send(output(false, users, '请求成功'));
    });
  },
  handleUserReg(req, res) {
    User.find({
      'username': req.body.username
    }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        if (user.length) {
          res.send(output(false, null, '用户名已存在'));
        } else {
          let data = {
            username: req.body.username,
            password: req.body.password
          };
          let user = new User(data);
          user.save((err) => {
            if (err) {
              res.send(output(false, null, '用户注册失败'));
            } else {
              res.send(output(true, {
                username: user.username
              }, '用户注册成功'));
            }
          });
        }
      }
    });
  },
  handleUserLogin(req, res) {
    User.find({
      'username': req.body.username
    }, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
        if (!user.length) {
          res.send(output(false, null, '用户名不存在，请注册'));
        } else {
          if (user[0].password !== req.body.password) {
            res.send(output(false, null, '密码错误，请重试'));
          } else {
            res.send(output(true, {
              username: user[0].username
            }, '登录成功'));
          }
        }
      }
    });
  }
};

module.exports = userController;
