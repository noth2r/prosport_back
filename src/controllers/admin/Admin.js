"use strict"

const { Authentication, Operations } = require("@models/admin")

class Admin {
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const data = await Authentication.login(email, password)

            // Установка cookie
            res.cookie(
                "refreshToken", /* Name */
                data.refreshToken, /* Data */
                {
                    maxAge: 15 * 60 * 60 * 24 * 1000, // 15 дней
                    httpOnly: true, // Отсутствие доступа к cookie на клиенте
                },
            )

            return res.json(data)
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await Authentication.logout(refreshToken)
            
            res.clearCookie("refreshToken")

            return res.json(token)
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    async validate(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization
            const accessToken = authorizationHeader?.split(' ')?.[1]
            const data = Authentication.validateToken(accessToken)

            res.json(data)
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    async removeProduct(req, res, next) {
        try {
            const { id } = req.body
            const data = await Operations.removeProduct(id)

            res.json(data)
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    async removeProductImg(req, res, next) {
        try {
            const { id } = req.body
            const data = await Operations.removeProductImg(id)

            res.json(data)
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    async updateProduct(req, res, next) {
        try {
            const img = req.files?.img_file
            const body = req.body
            const result = await Operations.updateProduct(body, img)

            res.json(result)
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await Authentication.activateByLink(activationLink)

            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            throw new Error(error.msg)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body
            const userData = await Authentication.refresh(refreshToken)
            
            // Установка cookie
            res.cookie(
                "refreshToken", /* Name */
                userData.refreshToken, /* Data */
                {
                    maxAge: 15 * 60 * 60 * 24 * 1000, // 15 дней
                    httpOnly: true, // Отсутствие доступа к cookie на клиенте
                },
            )

            return res.json(userData)
        } catch (error) {
            throw new Error(error.msg)
        }
    }
}

module.exports = new Admin()