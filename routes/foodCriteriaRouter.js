const router = require("express").Router();

const { createFoodCriteria, getAllFoodCriteria, updateFoodCriteria, deleteFoodCriteria} = require("../controllers/trx_food_criteriaController");
const validation = require("../middlewares/validation");
const { trx_food_criteria } = require('../utils/joiValidation');

router.post("/", validation(trx_food_criteria), createFoodCriteria);
router.get("/", getAllFoodCriteria);
router.patch("/:id", updateFoodCriteria);
router.delete("/:id", deleteFoodCriteria);

module.exports = router