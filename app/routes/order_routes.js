// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Order = require('../models/order')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX all orders for tokenized customer
// GET
router.get('/orders', requireToken, (req, res, next) => {
  Order.find()
    .then(orders => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return orders.map(order => order.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(orders => res.status(200).json({ orders: orders }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW order with ID
// GET
router.get('/orders/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Order.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "example" JSON
    .then(order => res.status(200).json({ order: order.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE a new order for customer with ID
// POST
router.post('/orders', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.order.owner = req.user.id

  Order.create(req.body.order)
    // respond to successful `create` with status 201 and JSON of new "example"
    .then(order => {
      res.status(201).json({ example: order.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE order with ID
// PATCH
router.patch('/orders/:id', requireToken, (req, res, next) => {
  const newOrderStatus = req.body.order.status

  Order.findById(req.params.id)
    .then(order => {
      order.status = newOrderStatus
      return order.save()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// CREATE a new order-item for order with ID
// POST
router.post('/orders/:id/orderItem', requireToken, (req, res, next) => {
  Order.findById(req.params.id)
    .then(order => {
      order.orderItems.push(req.body.orderItem)
      return order.save()
    })
    .then(order => {
      res.status(201).json({ order: order.toObject() })
    })
    .catch(next)
})

// UPDATE order-item
// PATCH
router.patch('/orders/:orderId/orderItem/:orderItemId', requireToken, (req, res, next) => {
  const orderItemId = req.params.orderItemId
  const newOrderItemQuantity = req.body.orderItem.quantity
  console.log(orderItemId)
  console.log(newOrderItemQuantity)

  Order.findById(req.params.orderId)
    .then(handle404)
    .then(order => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, order)

      const updatedOrderItems = order.orderItems.map(orderItem => {
        if (orderItem._id == orderItemId) {
          orderItem.quantity = newOrderItemQuantity
          return orderItem
        } else {
          return orderItem
        }
      })
      order.orderItems = updatedOrderItems
      return order.save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY Order item
// DELETE
router.delete('/orders/:orderId/orderItem/:orderItemId', requireToken, (req, res, next) => {
  const orderId = req.params.orderId
  const orderItemId = req.params.orderItemId
  Order.findById(orderId)
    .then(handle404)
    .then(order => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, order)
      // delete the example ONLY IF the above didn't throw
      // Find order by ID, filter out the order item id
      // that needs deleting, and replace the order-items
      // array with the filtered array.
      const filteredOrderItems = order.orderItems.filter(item => item._id != orderItemId)
      order.orderItems = filteredOrderItems
      return order.save()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY Order
// DELETE
router.delete('/orders/:id', requireToken, (req, res, next) => {
  Order.findById(req.params.id)
    .then(handle404)
    .then(order => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, order)
      // delete the example ONLY IF the above didn't throw

      return order.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
