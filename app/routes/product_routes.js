// Express docs: http://expressjs.com/en/api.html
const express = require('express')

// pull in Mongoose model for examples
const Product = require('../models/product')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX all products for all visitors to the website
// GET
router.get('/products', (req, res, next) => {
  Product.find()
    .then(products => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return products.map(product => product.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(products => res.status(200).json({ products: products }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// todo: comment out for deployment
// SHOW product with ID
// GET
router.get('/products/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Product.findById(req.params.id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "example" JSON
    .then(product => res.status(200).json({ product: product.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// todo: comment out for deployment
// CREATE a new product
// POST
router.post('/products', (req, res, next) => {
  Product.create(req.body.product)
    // respond to successful `create` with status 201 and JSON of new "example"
    .then(product => {
      res.status(201).json({ product: product.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// todo: comment out for deployment
// DESTROY product
// DELETE
router.delete('/products/:id', (req, res, next) => {
  Product.findById(req.params.id)
    .then(handle404)
    .then(product => {
      return product.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
