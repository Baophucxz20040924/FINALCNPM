const accountModel = require('../models/account.model');

module.exports = {
  register: async (req, res) => {
    const body = req.body;

    const acc = await accountModel.create(body);

    return res.status(201).json(acc);
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    const acc = await accountModel.findOne({ username, password });

    if (!acc) {
      return res.status(400).json({
        status: 400,
        message: 'Tài khoản hoặc mật khẩu không đúng',
      });
    }

    return res.status(200).json(acc);
  },
};
