const ProductsService = require("../../models/products/")
class Products {
    async get(req, res) {
        try {
            const from = +req.query.from || 0
            const products = await ProductsService.get(from)
    
            res.json(products)
        } catch(e) {
            throw new Error(e)
        }
    }

    // Функция поиска товаров
    async search(req, res) {
        try {
            const query = req.query
            const userQuery = query.q
            const from = +query.from || 0
            const products = await ProductsService.search(userQuery, from)
            
            res.json(products)
        } catch (e) {
            throw new Error(e)
        }
    }

    async getProductsByCategory(req, res) {
        try {
            const from     = +req.query.from || 0
            const category =  req.query.category || ''
            const products = await ProductsService.getByCategory(category, from)
    
            res.json(products)
        } catch ( error ) {
            throw new Error( error )
        }
    }

    async getProductsById(req, res) {
        try {
            const productsID = req.body

            if( !productsID || productsID.length === 0 )
                return res.status(400)

            const products = await ProductsService.getProductsById( productsID )

            res.json(products)
        } catch (e) {
            throw new Error(e)
        }
    }

    async orderProducts(req) {
        try {
            const orderId = await ProductsService.orderProducts( req.body )

            return orderId
        } catch ( error ) {
            throw new Error(error)
        }
    }
}

module.exports = new Products