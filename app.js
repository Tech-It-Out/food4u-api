// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// require route files
const orderRoutes = require('./app/routes/order_routes')
const userRoutes = require('./app/routes/user_routes')
const productRoutes = require('./app/routes/product_routes')
const checkoutRoutes = require('./app/routes/checkout_routes')
const healthRoutes = require('./app/routes/health_routes')

// require middleware
const errorHandler = require('./lib/error_handler')
const requestLogger = require('./lib/request_logger')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const config = require('./config/config')

// require configured passport authentication middleware
const auth = require('./lib/auth')

async function startApp () {
  // establish database connection
  // use new version of URL parser
  // use createIndex instead of deprecated ensureIndex
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })

  // instantiate express application object
  const app = express()
  // set CORS headers on response from this API using the `cors` NPM package
  // `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
  app.use(cors({ origin: process.env.CLIENT_ORIGIN }))

  // register passport authentication middleware
  app.use(auth)

  // add `express.json` middleware which will parse JSON requests into
  // JS objects before they reach the route files.
  // The method `.use` sets up middleware for the Express application
  app.use(express.json())

  // delineate the spacing for all json logging to the console
  app.set('json spaces', 2)

  // this parses requests sent by `$.ajax`, which use a different content type
  app.use(express.urlencoded({ extended: true }))

  // log each request as it comes in for debugging
  app.use(requestLogger)

  app.get('/', (req, res) => {
    res.send('Server is listening for requests')
  })

  // register route files
  app.use(orderRoutes)
  app.use(userRoutes)
  app.use(productRoutes)
  app.use(checkoutRoutes)
  app.use(healthRoutes)

  // register error handling middleware
  // note that this comes after the route middlewares, because it needs to be
  // passed any error messages from them
  app.use(errorHandler)

  return app
}

module.exports = {
  startApp
}
