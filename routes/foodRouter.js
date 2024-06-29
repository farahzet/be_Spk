const router = require("express").Router();

const { createFood, getAllFood, updateFood, deleteFood} = require("../controllers/adminFoodController");
const validation = require("../middlewares/validation");
const { food, createfood } = require('../utils/joiValidation');
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/checkRole");


router.post("/create", authenticate, checkRole('admin'), validation(createfood), createFood);
router.get("/", validation(food), getAllFood);
router.patch("/:id", authenticate, checkRole('admin'), validation(food), updateFood);
router.delete("/:id", authenticate, checkRole('admin'), validation(food), deleteFood);

module.exports = router