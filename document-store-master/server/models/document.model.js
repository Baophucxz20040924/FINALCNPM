const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
      unique: true,
    },
    images: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('document', documentSchema);
