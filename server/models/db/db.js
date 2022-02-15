"use strict";

const mysql = require("mysql2");

class db {
  constructor() {
    this.dbConfig = {
      host: process.env.MYSQL_HOST,
      database: process.env.MYSQL_DB,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    };
  }

  get tables() {
    return {
      products: {
        name: "`products`",
        keys: "(`product_category`, `product_subcategory`, `purchases`, `title`, `description`, `units`, `price`, `quantity`, `amount`, `img_path`)",
      },
      tokens: {
        name: "`tokens`",
        keys: "(`user`, `refresh_token`)",
      },
      admins: {
        name: "`managers`",
        keys: "(`email`, `password`, `is_activated`, `activation_link`)",
      },
      orders: {
        name: "`orders`",
        keys: "(`product_id`, `mail`, `phone`, `address`, `comment`, `amount`)",
      },
    };
  }

  query(query) {
    let response = null
    let connection = mysql.createConnection(this.dbConfig)

    connection
        .promise()
        .query(query)
        .then(([ rows ]) => response = rows)
        .then(connection.end())
        .catch(error => {
            throw new Error(error)
        })

    return response;
  }
}

module.exports = new db();
