const router = require("express-promise-router")()
const { Admin, ExcelAsDBTables } = require("../controllers/admin")
const { body } = require("express-validator")
const { AuthMiddleware } = require("../middlewares")

router.route("/login")
    .post(
        body("email").isEmail(),
        (req, res, next) => Admin.login(req, res, next)
    )
router
    .route("/logout")
    .post((req, res, next) => Admin.logout(req, res, next))
router
    .route("/activate/:link")
    .get((req, res, next) => Admin.activate(req, res, next))
router
    .route("/refresh")
    .post((req, res, next) => Admin.refresh(req, res, next))
router
    .route("/validate")
    .post((req, res, next) => Admin.validate(req, res, next))
router
    .route("/update_product")
    .post(async (req, res, next) => {
        AuthMiddleware(req, res)
        if (!res.headersSent) {
            Admin.updateProduct(req, res, next)
        }
    })
router
    .route("/remove_product")
    .post(async (req, res, next) => {
        AuthMiddleware(req, res)
        if (!res.headersSent) {
            await Admin.removeProduct(req, res, next)
        }
    })
router
    .route("/remove_product_img")
    .post(async (req, res, next) => {
        AuthMiddleware(req, res)
        if (!res.headersSent) {
            await Admin.removeProductImg(req, res, next)
        }
    })
router
    .route("/excel_export")
    .post(async (req, res, next) => {
        AuthMiddleware(req, res)
        if (!res.headersSent) {
            await ExcelAsDBTables.structure(req, res)
        }
    })

module.exports = router