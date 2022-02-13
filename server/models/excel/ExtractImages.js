"use strict"

const ConvertToZip = require("./ConvertToZip.js")

const fsPromises = require("fs.promises")
const AdmZip = require("adm-zip")

class ExtractImages {
    constructor(filePath, extractionPath) {
        this.filePath = filePath
        this.extractionPath = extractionPath
    }

    async _renameTo(from, to) {
        const newPath = this.filePath.replace(from, to)

        try {
            // Is file exists
            await fsPromises.access(this.filePath, fsPromises.F_OK)

            // Rename file
            await fsPromises.rename(this.filePath, newPath)

            // Update file path
            this.filePath = newPath
        } catch (err) {
            throw new Error(err)
        }
    }

    _extractImages(zip, zipEntries) {
        const pictureNames = []

        // Trying to export images
        try {
            zipEntries.forEach(entry => {
                if (entry.entryName.includes("xl/media")) {
                    pictureNames.push(entry.name)
                    zip.extractEntryTo(
                        entry.entryName, /* Filename */
                        this.extractionPath, /* Path */
                        false, /* Create a folder if it doesn't not exist */
                        true /* Overwrite files if they already exist */
                    )
                }
            })

            return pictureNames
        } catch (err) {
            throw new Error(err)
        }
    }

    async extract() {
        try {
            const path = await ConvertToZip.convert(this.filePath)
            // const zip = new AdmZip(path)

            // // Reading data from a ZIP file
            // const zipEntries = zip.getEntries()
            // // Inserting pictures and getting their paths
            // const pathsForPictures = this._extractImages(zip, zipEntries)

            // return pathsForPictures
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = ExtractImages