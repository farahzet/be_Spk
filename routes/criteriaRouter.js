const router = require("express").Router();

const {createCriteria, getAllCriteria, updateCrireia, deleteCriteria} = require("../controllers/adminCriteriaController");
const validation = require("../middlewares/validation");
const { criteria } = require('../utils/joiValidation');

router.post("/create", validation(criteria), createCriteria);
router.get("/", validation(criteria), getAllCriteria);
router.patch("/:id", updateCrireia);
router.delete("/:id", deleteCriteria);

module.exports = router