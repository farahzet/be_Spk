const router = require("express").Router();

const { login, register, getUserLoggedIn, getUserCalculationV, getUserRegisterIn } = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const checkRole = require("../middlewares/checkRole");
const validation = require("../middlewares/validation");
const { onlyEndUser, loginSchema} = require('../utils/joiValidation');

router.post("/login", validation(loginSchema), login);
// router.get('/', getUserLoggedIn)
router.post('/register', validation(onlyEndUser), register)
router.get('/user-calculation', getUserCalculationV)
router.get('/user-register', authentication, getUserRegisterIn)


module.exports = router