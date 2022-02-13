"use strict"

const mysql = require('mysql2')

class db {
    constructor() {
        this.dbConfig = {
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DB,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        }
    }

    get tables() {
        return {
            products: {
                name: "`products`",
                keys: "(`product_category`, `product_subcategory`, `purchases`, `title`, `description`, `units`, `price`, `quantity`, `amount`, `img_path`)"
            },
            tokens: {
                name: "`tokens`",
                keys: "(`user`, `refresh_token`)"
            },
            admins: {
                name: "`managers`",
                keys: "(`email`, `password`, `is_activated`, `activation_link`)"
            },
            orders: {
                name: "`orders`",
                keys: "(`product_id`, `mail`, `phone`, `address`, `comment`, `amount`)"
            },
        }
    }

    async query(query) {
        // Подключение
        const connection = mysql.createConnection(this.dbConfig)

        // Ответ базы данных в виде промиса
        const res = connection.promise().query(query)
            .then(([rows, fields], err) => {
                // Если есть ошибка вывести ее
                if(err) {
                    throw new Error(err)
                }

                // Иначе вернуть положительный ответ
                // с полученными данными
                return rows
            })
            .catch(rej => {
                throw new Error(rej)
            })

        // Завершить подключение
        connection.end((err) => {
            // В случае ошибки вывести ее
            if(err) {
                throw new Error(err)
            }
        })

        // Вернуть ответ сервера
        return res
    }
}

module.exports = new db