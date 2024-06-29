const router = require("express").Router();

const { createActivity, getAllActivity, updateActivity, deleteActivity} = require("../controllers/adminActivityController");
const validation = require("../middlewares/validation");
const { activity } = require('../utils/joiValidation');


router.post("/", validation(activity), createActivity);
router.get("/", getAllActivity);
router.patch("/:id", updateActivity);
router.delete("/:id", deleteActivity);

module.exports = router

