const router = require("express").Router();

const { login, register, getUserCalculationV, getUserRegisterIn, getProfile } = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const checkRole = require("../middlewares/checkRole");
const validation = require("../middlewares/validation");
const { onlyEndUser, loginSchema} = require('../utils/joiValidation');

router.post("/login", login);
router.get('/profile', authentication,  getProfile)
router.post('/register', register)
router.get('/user-calculation', getUserCalculationV)
router.get('/user-register', authentication, getUserRegisterIn)


module.exports = router