const router = require("express").Router();

const { createFood, getAllFood, updateFood, deleteFood, getTableName} = require("../controllers/adminFoodController");
const validation = require("../middlewares/validation");
const { food, createfood } = require('../utils/joiValidation');
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/checkRole");
const { getAllFoodCalculation } = require("../controllers/adminTrx_calculationController");


// router.post("/create", authenticate, checkRole('admin'), validation(createfood), createFood);
router.post("/create", authenticate,  createFood);
// router.get("/", authenticate, validation(food), getAllFood);
router.patch("/:id", authenticate, checkRole('admin'), validation(food), updateFood);
router.delete("/:id", authenticate, checkRole('admin'), validation(food), deleteFood);
router.get('/food-calculation', getAllFoodCalculation)
router.get("/table-name" , getTableName)
router.get("/", getAllFood);


module.exports = router