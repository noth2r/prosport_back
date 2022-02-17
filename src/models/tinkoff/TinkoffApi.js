"use strict";

const db = require("@models/db");
const TinkoffMerchantAPI = require("tinkoff-merchant-api");
const TerminalKey = process.env.TINKOFF_TERMINAL_KEY;
const SecretKey = process.env.TINKOFF_SECRET_KEY;

class TinkoffApi {
  constructor() {
    this.api = new TinkoffMerchantAPI(TerminalKey, SecretKey);
  }

  _getProductsById(id = []) {
    return db
      .query(` SELECT * FROM products WHERE id IN (${id}) `)
      .catch((error) => {
        throw new Error(error.msg);
      });
  }

  _getOrderId() {
    return db
      .query(`SELECT MAX(id) FROM ${db.tables.orders.name}`)
      .then((res) => {
        return res[0]["MAX(id)"];
      })
      .catch((error) => {
        throw new Error(error.msg);
      });
  }

  async Init({ form }) {
    try {
      const OrderId = await this._getOrderId();
      const Items = form.items;
      const Amount = form?.amount || 0;
      const dto = {
        TerminalKey,
        Amount,
        OrderId,
        DATA: {
          Email: form?.email,
          Phone: form?.phone,
        },
        Receipt: {
          Email: form?.email,
          Phone: form?.phone,
          Items,
          Taxation: "osn",
        },
      };

      return this.api.init(dto).catch((error) => {
        console.error(error.stack);
      });
    } catch (error) {
      throw new Error(error.msg);
    }
  }
}

module.exports = new TinkoffApi();
