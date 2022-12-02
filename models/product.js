const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  A0price: {
    type: Number,
    required: true
  },
  A1price: {
    type: Number,
    required: true
  },
  A2price: {
    type: Number,
    required: true
  },
  A3price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
