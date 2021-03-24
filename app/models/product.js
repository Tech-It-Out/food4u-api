const mongoose = require('mongoose')
const { capitalize } = require('../../lib/util')

const skuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: capitalize
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imgUrl: {
    type: String,
    required: true
  },
  stock: {
    type: Number
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', skuSchema)
