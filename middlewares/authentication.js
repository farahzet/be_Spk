const {users} = require("../models");
const jwt = require('jsonwebtoken');
const ApiError = require("../utils/apiError");


module.exports = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;

        if (!bearerToken) {
            return next (new ApiError("Token  not found", 400))
        }

        const token = bearerToken.split('Bearer ')[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const userData = await users.findOne({
            where: {
                id: payload.user_id,
                
            },
        });

        // const userData = await users.findByPk(payload.id);

        if(!userData){
            return next (new ApiError ("User not found", 400))
        }
        req.userData=userData;
        next();

        
    } catch (err) {
        return next(new ApiError(err.message, 500));
    }
}