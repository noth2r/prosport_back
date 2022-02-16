"use strict"

const fsPromises = require("fs.promises")
const XLSX = require("xlsx-pro")

class Excel {
    static async Read(path = String) {
        try {
            const data = await fsPromises.readFile(path)
            const workBook = XLSX.read(data, { type: "array" })
            const sheetNames = workBook.SheetNames
            const xlData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
            
            return xlData
        } catch(e) {
            throw new Error(e)
        }
    }
}

module.exports = Excel