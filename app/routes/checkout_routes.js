const { stripeSecretKey } = require('../../config/config')
const stripe = require('stripe')(stripeSecretKey)
const express = require('express')
const getTotalDueFromCart = require('../../lib/get_total_due_from_cart')
const passport = require('passport')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// set req.user
// requires submission of token
const requireToken = passport.authenticate('bearer', { session: false })

// setting the domain to either the deployed app or the localhost on domain 7165
const YOUR_DOMAIN = process.env.CLIENT_ORIGIN

router.post('/create-checkout-session',
  requireToken,
  getTotalDueFromCart,
  async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shopping Cart',
              images: ['https://i.imgur.com/Xg0zYP5.png']
            },
            unit_amount: req.body.cartValue
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/#/?checkout=success`,
      cancel_url: `${YOUR_DOMAIN}/#/?checkout=failure`
    })
    res.json({ id: session.id })
  })

module.exports = router
