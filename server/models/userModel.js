const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义模式
const userModel = new Schema({
  username: String,
  password: String,
  is_online: Boolean,
  information: {
    sex: {
      type: String,
      default: ''
    },
    area: {
      type:String,
      default:'china'
    },
    career: {
      type:String,
      default:''
    }
  }
});

//导出模式
module.exports = mongoose.model('userdbs', userModel);
