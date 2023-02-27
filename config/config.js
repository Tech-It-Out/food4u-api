'use strict'

const mongoURI = process.env.MONGO_URI
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

module.exports = {
  mongoURI,
  stripeSecretKey
}
