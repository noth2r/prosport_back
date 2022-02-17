const router = require('express-promise-router')()
const { products } = require(`@controllers/products`)

router.route('/').get(products.get.bind(products))
router.route('/get_products_by_category').get(products.getProductsByCategory.bind(products))
router.route('/search').get(products.search.bind(products))
router.route('/get_products_by_id').post(products.getProductsById.bind(products))

module.exports = router