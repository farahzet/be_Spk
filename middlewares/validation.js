const createHttpError = require('http-errors');
const ApiError = require("../utils/apiError");


module.exports = (schema) => {
    return async (req, res, next) => {
        try {
            const validated = await schema.validateAsync(req.body)
            req.body = validated;
            next();
        } catch (error) {
            if (error.isJoi) return next(new ApiError(error.message, 400))

                return next(new ApiError(err.message, 500));
        }
    }
}