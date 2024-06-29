const ApiError = require('../utils/apiError');

module.exports = (allowedRoles) => {
    return async (req, res, next) => {
        let role = req.user !== undefined ? req.user.role : 'admin';

        try {
                const user = req.user;
                if (!user){
                    return next (new ApiError("User not found", 401))
                }
                if(!allowedRoles.includes(role)) {
                    return next ( new ApiError('Does not have access permission',400))
                }
                next()
        } catch (err) {
            return next(new ApiError(err.message,500))           
        }
    }
}