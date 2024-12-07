const mongoose = require('mongoose');
const accountModel = require('../models/account.model');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/buy_documents');

    let admin = await accountModel.findOne({
      username: 'admin',
    });
    if (!admin) {
      await accountModel.create({
        username: 'admin',
        password: 'admin',
        role: 'admin',
      });
      console.log('admin created');
    }

    console.log('Kết nối db thành công');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
