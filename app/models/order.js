const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['cart', 'complete']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)
