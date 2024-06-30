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
        // console.log('Payload:', payload);

        // const userData = await users.findOne({

        //     where: {
        //         id: payload.user_id,
                
        //     },
        // });

        // console.log('User ID:', payload.user_id);
        
        const userData = await users.findByPk(payload.user_id);
        console.log('User ID:', payload.user_id);

        req.user = userData;

        if(!userData.id){
            console.log("masuk")
            return next (new ApiError ("User not found", 400))
        }
        console.log('User Data:', userData.id);
        next();

        
    } catch (err) {
        return next(new ApiError(err.message, 500));
    }
}