const router = require("express").Router();

const { login, register, getUserLoggedIn } = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");
const validation = require("../middlewares/validation");
const { onlyEndUser} = require('../utils/joiValidation');

router.post("/login", login);
// router.get('/', getUserLoggedIn)
router.post('/register', validation(onlyEndUser), register)


module.exports = router