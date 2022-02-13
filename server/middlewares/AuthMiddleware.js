const Token = require("../models/token")

module.exports = function (req, res) {
    try {
        const authorizationHeader = req.headers.authorization
        const accessToken = authorizationHeader?.split(' ')?.[1]
        const userData = Token.validateAccessToken(accessToken)

        if (!authorizationHeader || !accessToken || !userData) {
            return res.send({
                status: 401,
                msg: "Вы не авторизованы",
            })
        }

        req.user = userData
    } catch (e) {
        throw new Error(e)
    }
}