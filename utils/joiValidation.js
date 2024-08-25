const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).alphanum().required(),
});

const activity = Joi.object({
    activity_name: Joi.string().required(),
    activity_level: Joi.string().required(),
    bobot: Joi.number().precision(2).required(),
})

const createActivitySchema = Joi.object({
    activity_name: Joi.string(),
    activity_level: Joi.string(),
    bobot: Joi.number().precision(2),
})

const createCriteriaSchema = Joi.object({
    criteria_code: Joi.string(),
    criteria_name: Joi.string(),
    bobot: Joi.number().precision(2),
    tren: Joi.string(),
})

const criteria = Joi.object({
    criteria_code: Joi.string(),
    criteria_name: Joi.string(),
    bobot: Joi.number().precision(2),
    tren: Joi.string(),
})

const food = Joi.object({
    food_code: Joi.string(),
    food_name: Joi.string(),
    food_desc: Joi.string(),
})

const createfood = Joi.object({
    food_code: Joi.string().required(),
    food_name: Joi.string().required(),
    food_desc: Joi.string().required(),
})

const trx_calculationAdmin = Joi.object({
    user_id: Joi.number().integer().required(),
    food_id: Joi.number().integer().required(),
    activity_id: Joi.number().integer().required(),
    weight: Joi.number().integer().required(),
    height: Joi.number().integer().required(),
    gender: Joi.string().required(),
    age: Joi.number().integer().required(),
})

const trx_calculationUser = Joi.object({
    user_id: Joi.number().integer().required(),
    food_id: Joi.number().integer().required(),
    activity_id: Joi.number().integer().required(),
    weight: Joi.number().integer().required(),
    height: Joi.number().integer().required(),
    gender: Joi.string().required(),
    age: Joi.number().integer().required(),
})

const trx_food_criteria = Joi.object({
    food_id: Joi.number().integer().required(),
    criteria_id: Joi.number().integer().required(),
    calculation: Joi.number().precision(2).required(),
})

const trx_food_createcriteria = Joi.object({
    food_id: Joi.number().integer().required(),
    criteria_id: Joi.number().integer().required(),
    calculation: Joi.number().precision(2).required(),
})


const onlyEndUser = Joi.object({
    username: Joi.string().max(60).required(),
    role: Joi.string().required().valid("endUser","admin"),
    email: Joi.string().email().required(),
    phone: Joi.string().max(13),
    password: Joi.string().min(8).alphanum().required(),
    confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
        "any.only": "Confirm password does not match password",
    }),
});
module.exports = {
    onlyEndUser,
    loginSchema,
    criteria,
    createCriteriaSchema,
    food,
    createfood,
    activity,
    createActivitySchema,
    trx_calculationAdmin,
    trx_calculationUser,
    trx_food_createcriteria,
    trx_food_criteria
}