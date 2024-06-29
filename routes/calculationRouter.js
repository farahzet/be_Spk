const router = require("express").Router();

const { createCalculation, getAllCalculation, updateCalculation, deletecalculation } = require("../controllers/adminTrx_calculationController");
const validation = require("../middlewares/validation");
const { trx_calculationAdmin, trx_calculationUser } = require('../utils/joiValidation');

router.post("/", validation(trx_calculationAdmin),createCalculation);
router.post("/user", validation(trx_calculationUser),createCalculation);
router.get("/", getAllCalculation);
router.patch("/:id", updateCalculation);
router.delete("/:id", deletecalculation);

module.exports = router