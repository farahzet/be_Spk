const router = require("express").Router();

const foodRouter = require("./foodRouter")
const criteriaRouter = require("./criteriaRouter")
const activityRouter = require("./activityRouter")
const userRouter = require("./userRouter")
const calculationRouter = require("./calculationRouter")
const FoodcriteriaRouter = require("./foodCriteriaRouter")


router.use("/api/v1/food", foodRouter)
router.use("/api/v1/criteria", criteriaRouter)
router.use("/api/v1/activity", activityRouter)
router.use("/api/v1/user", userRouter)
router.use("/api/v1/calculation", calculationRouter)
router.use("/api/v1/foodcriteria", FoodcriteriaRouter)

module.exports = router;