const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义模式
const userModel = new Schema({
  username: String,
  password: String,
  is_online: Boolean
});

module.exports = mongoose.model('userdbs', userModel);
