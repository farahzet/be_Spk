const router = require("express").Router();

const { login, register, getUserLoggedIn, getUserCalculationV } = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");
const validation = require("../middlewares/validation");
const { onlyEndUser} = require('../utils/joiValidation');

router.post("/login", login);
// router.get('/', getUserLoggedIn)
router.post('/register', validation(onlyEndUser), register)
router.get('/user-calculation', getUserCalculationV)


module.exports = router