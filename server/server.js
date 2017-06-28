const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/userModel');

// 利用mongoose连接到数据库
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/userdb');
var db = mongoose.connection;

// 设置返回消息的格式
let output = function (status, data, info) {
  return JSON.stringify({
    status: status,
    data: data,
    info: info
  });
};

app.use((req, res, next) => {
  res.header('Content-Type', 'application/x-www-form-urlencoded');
  res.header('Content-Type', 'application/json');
  next();
});

app.get('/', function (req, res) {
  res.send('<h1>Welcome Realtime Server</h1>');
});

io.on('connection', (socket) => {
  // 响应登录事件
  socket.on('login', (user) => {
    console.log(user);
    User.find({
      'username': user.username
    }, (err, users) => {
      if (err) {
        console.log(err);
      } else {
        if (!users.length) {
          socket.emit('loginMsg', output(false, null, '用户名不存在，请注册'));
        } else {
          if (users[0].password !== user.password) {
            socket.emit('loginMsg', output(false, null, '密码错误，请重试'));
          } else {
            User.find((err, users) => {
              if (err) {
                console.log(err);
              }
              console.log(users);
            });
            socket.emit('loginMsg', output(true, {
              username: users[0].username
            }, '登录成功'));
          }
        }
      }
    });
  });
  // 响应注册事件
  socket.on('regist', (user) => {
    User.find({
      'username': user.username
    }, (err, users) => {
      let temp = user;
      if (err) {
        console.log(err);
      } else {
        if (users.length) {
          socket.emit('registMsg', output(false, null, '用户名已存在，请更换用户名'));
        } else {
          let data = {
            username: temp.username,
            password: temp.password
          };
          let user = new User(data);
          console.log(user);
          user.save((err) => {
            if (err) {
              socket.emit('registMsg', output(false, null, '用户注册失败'));
            } else {
              console.log('run to here');
              socket.emit('registMsg', output(true, {
                username: user.username
              }, '用户注册成功'));
            }
          });
        }
      }
    });
  });
  // 响应获取在线用户列表事件
  socket.on('fetchList', (data) => {
    User.find((err, users) => {
      if (err) {
        console.log(err);
      }
      socket.send(output(false, users, '请求成功'));
    });
  });
});

http.listen(3000, () => {
  console.log('listening on localhost:3000');
});