const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    account_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'account',
      required: true,
    },
    document_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'document',
      required: true,
    },
    payment_method: {
      type: String,
      enum: ['momo'],
      default: 'momo',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failure'],
      default: 'pending',
    },
    transaction_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('order', orderSchema);
