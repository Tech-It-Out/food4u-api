const mongoose = require('mongoose')
const { capitalize } = require('../../lib/util')

const orderItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    set: capitalize
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }

}, {
  timestamps: true
})

module.exports = orderItemSchema
