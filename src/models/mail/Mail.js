"use strict"

const nodeMailer = require("nodemailer")

class Mail {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }

    async sendActivationLink(to, link) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: "Активируйте аккаунт на " + process.env.API_URL,
                text: "",
                html:
                    `
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href=${link}>${link}</a>
                    `
            })
        } catch (error) {
            throw new Error(error.msg)
        }
    }
}

module.exports = Mail