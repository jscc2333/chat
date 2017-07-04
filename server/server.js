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
          } else if (users[0].is_online) {
            socket.emit('loginMsg', output(false, null, '当前账户已在线，请勿重新登录'));
          } else {
            User.update({
              username: user.username
            }, {
              $set: {
                is_online: true
              }
            }, (err) => {
              if (err) {
                console.log(err);
              } else {
                socket.emit('loginMsg', output(true, {
                  username: users[0].username
                }, '登录成功'));
              }
            });
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
            password: temp.password,
            is_online: false
          };
          let user = new User(data);
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
  socket.on('fetchList', (user) => {
    User.find({
      'is_online': true,
      'username': {
        '$ne': user.username
      }
    }, {
      'username': 1
    }, (err, users) => {
      if (err) {
        console.log(err);
      } else {
        socket.emit('provList', users);
      }
    });
  });

  socket.on('iamOnline', (user) => {
    socket.broadcast.emit('someoneOnline', user);
  });

  socket.on('iamOffline', (user) => {
    User.update({
      username: user.username
    }, {
      $set: {
        is_online: false
      }
    }, (err) => {
      if (err) {
        console.log(err);
      } else {
        socket.broadcast.emit('someoneOffline', user);
      }
    });
  });

  socket.on('sendMessage', (data) => {
    socket.broadcast.emit('broadMessage', data);
  });
});

http.listen(3000, () => {
  console.log('listening on localhost:3000');
});
