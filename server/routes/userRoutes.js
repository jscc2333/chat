const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.route('')
  .get(userController.handleUserList);
userRouter.route('/reg')
  .post(userController.handleUserReg);
userRouter.route('/login')
  .post(userController.handleUserLogin);

module.exports = userRouter;
