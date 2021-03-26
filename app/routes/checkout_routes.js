const stripe = require('stripe')('sk_test_51IZJoXB0yfyrGtyKgv6xLriw485ujQeH6ToonTagUaHkSoypf8po5VbXfBNbE3SWHy407YK4L9XMO5zAeqJRb4jU00OasZ9Zz9')
const express = require('express')
const getTotalDueFromCart = require('../../lib/get_total_due_from_cart')
const passport = require('passport')

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// set req.user
// requires submission of token
const requireToken = passport.authenticate('bearer', { session: false })

// setting the domain to either the deployed app or the localhost on domain 7165
const YOUR_DOMAIN = process.env.CLIENT_ORIGIN ? 'https://tech-it-out.github.io/Food4U-client' : 'http://localhost:7165'

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
      success_url: `${YOUR_DOMAIN}/#/`,
      cancel_url: `${YOUR_DOMAIN}/#/`
    })
    res.json({ id: session.id })
  })

module.exports = router
