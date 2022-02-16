"use strict"

const db = require("../db")
const FromToBinary = require("../from_to_binary")
const tableName = db.tables.products.name

class ProductsService {
    // Get products
    static async get(from = 0 /* Start product selection with */) {
        try {
            const products = await db.query(`
                SELECT * FROM ${tableName}
                WHERE quantity > 0
                ORDER BY id DESC
                LIMIT ${from}, 30
            `)
            const encodedProducts = FromToBinary.EncodeUTF8(products)

            return encodedProducts
        } catch (e) {
            throw new Error(e)
        }
    }

    static async getByCategory( category, from ) {
        try {
            const query = `
                SELECT * FROM ${tableName}
                WHERE product_category LIKE '%${category}%'
                    AND quantity > 0
                ORDER BY id DESC
                LIMIT ${from}, 14
            `
            const products = await db.query( query )
            const encodedProducts = FromToBinary.EncodeUTF8(products)

            return encodedProducts
        } catch ( error ) {
            throw new Error( error )
        }
    }

    // Create search query
    static _createSearchQuery(
        q = '' /* Query */,
        from = 0 /* Start product selection with */
    ) {
        return `
            SELECT * FROM products
            WHERE (
                product_category LIKE '%${q}%' OR
                product_subcategory LIKE '%${q}%' OR
                title LIKE '%${q}%'
            ) AND quantity > 0
            LIMIT ${from}, 30
        `
    }

    // Search products
    static async search(query, from) {
        try {
            const searchQuery = this._createSearchQuery(query, from)
            const products = await db.query(searchQuery)

            return products
        } catch (e) {
            throw new Error(e)
        }
    }

    static async getProductsById(productsId) {
        try {
            const query = `
                SELECT * FROM ${db.tables.products.name}
                WHERE id IN (${productsId})
            `

            return await db.query(query)
        } catch (e) {
            throw new Error()
        }
    }

    static async _putOrder({ form, productId }) {
        try {
            const ordersTable = db.tables?.orders
            const mail        = form?.mail    || ''
            const phone       = form?.phone   || ''
            const address     = form?.address || ''
            const comment     = form?.comment || ''
            const amount      = form?.amount  || 0

            await db.query(`
                INSERT INTO ${ordersTable.name} ${ordersTable.keys}
                VALUES ( '${productId}', '${mail}', '${phone}', '${address}', '${comment}', ${amount} )
            `)
        } catch( error ) {
            throw new Error( error )
        }
    }

    static async getLastOrderId() {
        try {
            const query         = ` SELECT MAX(id) FROM ${db.tables?.orders.name} `
            const queryResponse = await db.query( query )

            return queryResponse[0][ "MAX(id)" ]
        } catch ( error ) {
            throw new Error( error )
        }
    }

    static async orderProducts({ form, productId }) {
        try {
            await this._putOrder({ form, productId })
            
            return await this.getLastOrderId()
        } catch ( error ) {
            throw new Error( error )
        }
    }
}

module.exports = ProductsService