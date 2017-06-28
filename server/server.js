const express = require('express');
const userRouter = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/people');
var app = express();
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  res.header('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
  next();
});

app.listen(3000, () => {
  console.log('app listening on port 3000');
});

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: false
  }));

app.get('/', (req, res) => {
  res.send('yo,man!');
});

app.use('/user', userRouter);
