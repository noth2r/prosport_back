const router = require('express-promise-router')()
const { products } = require("../controllers/products")
const { TinkoffController } = require(`../controllers/payment_transactions`)

router.route('/order_products').post(( req, res, next ) => TinkoffController.Init(req, res))

module.exports = router;