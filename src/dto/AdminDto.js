"use strict"

class AdminDto {
    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.is_activated = model.is_activated
    }
}

module.exports = AdminDto