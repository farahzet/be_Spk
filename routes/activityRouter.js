const router = require("express").Router();

const { createActivity, getAllActivity, updateActivity, deleteActivity} = require("../controllers/adminActivityController");
const validation = require("../middlewares/validation");
const { activity, createActivitySchema } = require('../utils/joiValidation');
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/checkRole");


// router.post("/", authenticate, checkRole('admin'), validation(createActivitySchema), createActivity);
router.get("/", authenticate, checkRole('admin'), validation(activity), getAllActivity);
router.patch("/:id", authenticate, checkRole('admin'), validation(activity), updateActivity);
router.delete("/:id", authenticate, checkRole('admin'), validation(activity), deleteActivity);
router.post("/", createActivity);

module.exports = router

