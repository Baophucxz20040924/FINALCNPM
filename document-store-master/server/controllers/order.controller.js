const axios = require('axios');
const crypto = require('crypto');

const orderModel = require('../models/order.model');
const documentModel = require('../models/document.model');
const momoConfig = require('../configs/momo');

module.exports = {
  getOrders: async (req, res) => {
    const order = await orderModel
      .find()
      .populate('account_id')
      .populate('document_id')
      .sort({ createdAt: -1 });

    return res.status(200).json(order);
  },
  createOrder: async (req, res) => {
    const { account_id, document_id, payment_method } = req.body;

    const document = await documentModel.findById(document_id);

    const momoPaymentResponse = await paymentByMomo({
      amount: document.price,
      link: document.link,
    });

    await orderModel.create({
      account_id,
      document_id,
      payment_method,
      transaction_id: momoPaymentResponse.orderId,
    });

    return res.status(201).json(momoPaymentResponse);
  },
  callbackMomo: async (req, res) => {
    /**
    resultCode = 0: giao dịch thành công.
    resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
    resultCode <> 0: giao dịch thất bại.
   */
    const body = req.body;

    const { accessKey, secretKey, partnerCode, extraData } = momoConfig;

    const {
      amount,
      orderId,
      requestId,
      resultCode,
      transId,
      message,
      orderType,
      responseTime,
      payType,
    } = body;

    // Xây dựng rawSignature theo thứ tự đúng
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${body.orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    //signature
    var signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (signature === body.signature) {
      if (body.resultCode === 0) {
        //thanh toán thành công
        await orderModel.findOneAndUpdate(
          { transaction_id: body.orderId },
          { status: 'success' },
          { new: true },
        );
      } else {
        //thanh toán thất bại
        await orderModel.findOneAndUpdate(
          { transaction_id: body.orderId },
          { status: 'failure' },
          { new: true },
        );
      }
    }

    /**
   * Dựa vào kết quả này để update trạng thái đơn hàng
   * Kết quả log:
   * {
        partnerCode: 'MOMO',
        orderId: 'MOMO1712108682648',
        requestId: 'MOMO1712108682648',
        amount: 10000,
        orderInfo: 'pay with MoMo',
        orderType: 'momo_wallet',
        transId: 4014083433,
        resultCode: 0,
        message: 'Thành công.',
        payType: 'qr',
        responseTime: 1712108811069,
        extraData: '',
        signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
      }
   */

    return res.status(204).json(req.body);
  },
};

async function paymentByMomo({ amount, link }) {
  let {
    accessKey,
    secretKey,
    orderInfo,
    partnerCode,
    ipnUrl,
    requestType,
    extraData,
    orderGroupId,
    autoCapture,
    lang,
  } = momoConfig;

  const redirectUrl = 'http://localhost:4000/' + link;

  var orderId = partnerCode + new Date().getTime();
  var requestId = orderId;

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;

  //signature
  var signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: 'DocumentStore',
    storeId: 'DocumentStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  // options for axios
  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  // Send the request and handle the response
  let result;
  try {
    result = await axios(options);
    return {
      ...result.data,
    };
  } catch (error) {
    return res.status(500).json({ statusCode: 500, message: error.message });
  }
}
