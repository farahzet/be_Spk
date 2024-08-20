const router = require("express").Router();

const { createFoodCriteria, getAllFoodCriteria, updateFoodCriteria, deleteFoodCriteria, FoodCriteria, getFoodCriteriaV, getAllFoodCriterias, getAllFoodCriteriaCPI, getRank} = require("../controllers/trx_food_criteriaController");
const validation = require("../middlewares/validation");
const { trx_food_criteria, trx_food_createcriteria } = require('../utils/joiValidation');
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/checkRole");

router.post("/", authenticate, createFoodCriteria);
// // router.get("/", authenticate, checkRole('admin'), validation(trx_food_criteria), getAllFoodCriteria);
// router.patch("/:id", authenticate, checkRole('admin'), validation(trx_food_criteria), updateFoodCriteria);
// router.delete("/:id", authenticate, checkRole('admin'), validation(trx_food_criteria), deleteFoodCriteria);
router.post("/food", authenticate, FoodCriteria)
router.get("/food-cri", getAllFoodCriteria)
router.post("/", createFoodCriteria);
router.get("/allfoods", getFoodCriteriaV)
router.patch("/:id",authenticate, updateFoodCriteria);
router.delete("/:id", deleteFoodCriteria);
router.get("/CPI", getAllFoodCriteriaCPI )

// router.get("/rank", getRank)



module.exports = router