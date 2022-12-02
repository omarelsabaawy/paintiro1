const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

  date: {
    type: String,
    required: true
  },

  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  BuildingNumber: {
    type: String,
    required: true
  },
  floorNumber: {
    type: String,
    required: true
  },
  apartmentNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  totalPrice: {
    type: String,
    required: true
  },
  totalArts: {
    type: String,
    required: true
  },
  products: [
    {
      productId: { type: String, required: true },
      priceType: { type: String, required: true },
      quantity: { type: String, required: true },
    }
  ],
  shipped: {
    type: Boolean,
    required: true
  },
  onTheWay: {
    type: Boolean,
    required: true
  },
  delivered: {
    type: Boolean,
    required: true
  },
});

module.exports = mongoose.model('Order', orderSchema);
