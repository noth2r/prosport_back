"use strict"

const db = require("../db")
const jwt = require("jsonwebtoken")
const { AdminDto } = require("../../dto")

class Token {
    static async saveToken(userId, refreshToken) {
        try {
            const [tokenData] = await db.query(`
                SELECT * FROM ${db.tables.tokens.name}
                WHERE id='${userId}'
            `)

            if (tokenData) {
                return await db.query(`
                    UPDATE ${db.tables.tokens.name}
                    SET
                        refresh_token='${refreshToken}'
                `)
            }

            const token = await db.query(`
                INSERT INTO ${db.tables.tokens.name}
                ${db.tables.tokens.keys}
                VALUES ("${userId}", "${refreshToken}")
            `)

            return token
        } catch (e) {
            throw new Error(e)
        }
    }

    static validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

            return userData
        } catch(e) {
            return false
        }
    }

    static validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

            return userData
        } catch(e) {
            return false
        }
    }

    static generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "15d" })

        return {
            accessToken,
            refreshToken
        }
    }

    static async findToken(refreshToken) {
        const [data] = await db.query(`
            SELECT * FROM ${db.tables.tokens.name}
            WHERE refresh_token="${refreshToken}"
            LIMIT 1
        `)
            .catch(rej => {
                throw new Error(rej)
            })

        return data
    }

    static async removeToken(token) {
        try {
            // Имя таблицы
            const tokensTableName = db.tables.tokens.name
            // Получение информации о токене
            const [tokenData] = await db.query(`
                SELECT * FROM ${tokensTableName}
                WHERE refresh_token="${token}"
                LIMIT 1
            `)

            // Removing token...
            await db.query(`
                DELETE FROM ${tokensTableName}
                WHERE refresh_token="${token}"
                LIMIT 1
            `)

            return tokenData
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = Token