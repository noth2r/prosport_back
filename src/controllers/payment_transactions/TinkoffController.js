const Tinkoff         = require('@models/tinkoff')
const { products }    = require("@controllers/products")

class TinkoffController {
    static Init( req, res ) {
        Tinkoff.Init( req.body )
            .then( async ( response ) => {
                if ( response.ErrorCode != '0' ) {
                    throw new Error( "TinkoffAPI ERROR: " + response.ErrorCode )
                }
                response.OrderId = await products.orderProducts( req )
                res.send( response )
            })
            .catch( rej => {
                throw new Error( rej )
            })
    }
}

module.exports = TinkoffController