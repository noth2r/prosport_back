"use strict"

const db = require("@models/db")
const fsPromises = require("fs.promises")
const Excel = require("@models/excel")
const SaveFile = require("save-file")

/* 
    ** Table **
    product_category - Категория товара
    product_subcategory - Подкатегория товара
    title - Наименование товара
    description - Описание товара
    units - Единицы
    quantity - Количество
    price - Цена
*/

class ExcelAsDBTables {
    static get _product() {
        return {
            productCategory: "'Товары'",
            productSubcategory: "'Прочее'",
            title: "''",
            description: "''",
            units: "''",
            price: "''",
            quantity: 0,
            amount: 0,
            imgPath: "'not_found.svg'",
        }
    }

    static async _createInsertQuery(data = []) {
        try {
            const t = db.tables
            const values = []
            const productObjExample = this._product
            for (const product of data) {
                if (Object.keys(product).length <= 1)
                    continue

                const productObj = Object.assign({}, productObjExample)

                for (const key in product) {
                    if (typeof product[key] === "string") {
                        product[key] = product[key].replace(/\s+/g, ' ').trim()
                        product[key] = product[key].replace(/'/gi, '"')
                    }

                    if (key.includes("product_category")) {
                        productObj.productCategory = "'" + (product[key] || '') + "'"
                    }
                    else if (key.includes("product_subcategory")) {
                        productObj.productSubcategory = "'" + (product[key] || '') + "'"
                    }
                    else if (key.includes("title")) {
                        productObj.title = "'" + (product[key] || '') + "'"
                    }
                    else if (key.includes("description")) {
                        productObj.description = "'" + (product[key] || '') + "'"
                    }
                    else if (key.includes("units")) {
                        productObj.units = "'" + (product[key] || '') + "'"
                    }
                    else if (key.includes("price")) {
                        product[key] = String(product[key])
                        if (product[key].search(/руб/gi) === -1)
                            product[key] += " руб."
                        productObj.price = "'" + (product[key] || '') + "'"
                    }
                    else if (key.includes("quantity")) {
                        productObj.quantity = product[key] || 0
                    }
                    else if (key.includes("amount")) {
                        productObj.amount = product[key] || 0
                    }
                }

                values.push("(" + Object.values(productObj).join(',') + ")")
            }
            const query = `INSERT INTO` +
                ` ${t.products.name} ` +
                ` ${t.products.keys} ` +
                ` VALUES ` +
                ` ${values} ` +
                ` ; `

            return query
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    static async _removeDuplicates() {
        db.query(`
            delete from ${db.tables.products.name}
            where id not in (
                select max(id)
                from (select * from ${db.tables.products.name})
                as products
                group by title
            )
        `)
            .catch(rej => {
                throw new Error(rej)
            })
    }

    static async _onExtract(file) {
        try {
            const path = file.name

            const xlData = await Excel.Read(path)
            const insertQuery = await this._createInsertQuery(xlData)
            // console.log(insertQuery)

            // Insert data
            await db.query(insertQuery)
            // Remove duplicates
            await this._removeDuplicates()
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    static async structure(req, res) {
        try {
            const file = Object.values(req.files)[0]

            await SaveFile(file.data, file.name)

            // Working with a file
            await this._onExtract(file)
            await fsPromises.unlink(file.name)

            res.send("Success")
        } catch (error) {
            res
                .status(400)
                .send("Failed")
            throw new Error(error.msg)
        }
    }
}

module.exports = ExcelAsDBTables