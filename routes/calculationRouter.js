const router = require("express").Router();

const { createCalculation, getAllCalculation, updateCalculation, deletecalculation } = require("../controllers/adminTrx_calculationController");
const validation = require("../middlewares/validation");
const authenticate = require("../middlewares/authentication");
const { trx_calculationAdmin, trx_calculationUser } = require('../utils/joiValidation');
const checkRole = require("../middlewares/checkRole");

// router.post("/", validation(trx_calculationAdmin),createCalculation);
router.post("/user", authenticate, checkRole('admin' , 'endUser'), validation(trx_calculationUser),createCalculation);
router.get("/", authenticate, checkRole('admin'), validation(trx_calculationAdmin), getAllCalculation);
router.patch("/:id", authenticate, checkRole('admin'), validation(trx_calculationAdmin), updateCalculation);
router.delete("/:id", authenticate, checkRole('admin'), validation(trx_calculationAdmin), deletecalculation);
router.post("/" ,createCalculation);



module.exports = router