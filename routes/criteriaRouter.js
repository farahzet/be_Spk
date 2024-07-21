const router = require("express").Router();

const {createCriteria, getAllCriteria, updateCrireia, deleteCriteria, getFormName, getCriteriaForThead} = require("../controllers/adminCriteriaController");
const validation = require("../middlewares/validation");
const authenticate = require("../middlewares/authentication");
const checkRole = require("../middlewares/checkRole");
const { criteria, createCriteriaSchema } = require('../utils/joiValidation');

// router.post("/create", authenticate, checkRole('admin'), validation(createCriteriaSchema), createCriteria);
router.post("/create", createCriteria);
router.get("/", getAllCriteria);
router.get("/criteria-form", getFormName);
// router.get("/", authenticate, checkRole('admin'), validation(criteria), getAllCriteria);
// router.patch("/:id", authenticate, checkRole('admin'), validation(criteria), updateCrireia);
router.delete("/:id", authenticate, checkRole('admin'), validation(criteria), deleteCriteria);
// router.get("/criteria-form", authenticate, checkRole('admin'), validation(criteria), getFormName);
router.get("/criteria-thead", getCriteriaForThead);
router.patch("/:id", updateCrireia);

module.exports = router