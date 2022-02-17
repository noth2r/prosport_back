"use strict"

const db = require("@models/db")
const SaveFile = require("save-file")

class Operations {
    static async removeProduct(id) {
        try {
            const res = await db.query(`
                DELETE FROM ${db.tables.products.name}
                WHERE id="${id}"
                LIMIT 1
            `)

            return res
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    static async removeProductImg(id) {
        try {
            const res = await db.query(`
                UPDATE ${db.tables.products.name}
                SET img_path="not_found.svg"
                WHERE id="${id}"
            `)

            return res
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    static async updateProduct(body = {
        id: 0,
        product_category: "",
        product_subcategory: "",
        title: "",
        description: "",
        units: "",
        price: "",
        quantity: 0,
        amount: 0,
        img_path: "",
    }, img) {
        try {
            const twins = [
                `id = '${body.id}'`,
                `product_category = '${body.product_category}'`,
                `product_subcategory = '${body.product_subcategory}'`,
                `title = '${body.title}'`,
                `description = '${body.description}'`,
                `units = '${body.units}'`,
                `price = '${body.price}'`,
                `quantity = '${body.quantity}'`,
                `amount = '${body.amount}'`,
                `img_path = '${body.img_path}'`,
            ]
            const res = await db.query(`
                UPDATE ${db.tables.products.name}
                SET ${twins}
                WHERE id=${body.id}
            `)

            if (img) {
                const { name, data } = img
                const path = `@/media/images/${name}`

                SaveFile(data, path)
            }

            return res
        } catch (error) {
            throw new Error(error.msg)
        }
    }
}

module.exports = Operations