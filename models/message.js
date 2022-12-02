const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
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
  subject: {
    type: String,
    required: true
  },
  Message : {
    type: String,
    required: true
  },

});

module.exports = mongoose.model('Message', productSchema);
