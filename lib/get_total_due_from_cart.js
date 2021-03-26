// middleware for returning the total amount due based on the order with status "cart"

// pull in Mongoose model for orders
const Order = require('./../app/models/order')

module.exports = function (req, res, next) {
  // find all orders
  Order.find()
    .then(orders => {
      // filter orders that are owned by customer with ID
      // eslint-disable-next-line eqeqeq
      return orders.filter(order => order.owner == req.user.id)
    })
    .then(customerOrders => {
      // filter out the one order with status = cart
      return customerOrders.find(order => order.status === 'cart')
    })
    .then(cart => {
      // calculate total cart value
      return cart.orderItems.reduce((acc, currentValue) => {
        return acc + currentValue.quantity * currentValue.price
      }, 0)
    })
    .then(cartValue => {
      req.body.cartValue = cartValue.toFixed(2) * 100
      next()
    })
}
