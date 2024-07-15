
const ApiError = require("../utils/apiError");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { Sequelize } = require('sequelize');
const {users, user_calculation_v,sequelize } = require("../models")


const login =  async (req, res, next) => {
    try{
        
        const { email, password} = req.body;

        const findUser = await users.findOne({
            where: {
                email,
            }
        })

        if ( findUser && bcrypt.compareSync(password, findUser.password)){
            const token = jwt.sign(
                { 
                    user_id: findUser.id,
                    username: findUser.username,
                    role: findUser.role,
                    email: findUser.email,
                },
                process.env.JWT_SECRET,
                {
					expiresIn: process.env.JWT_EXPIRED,
				}
            )
            res.cookie('_token', token, {
                httpOnly: true,
				maxAge: 24 * 60 * 60 * 100,
            })

            res.status(200).json({
				status: true,
				message: 'user logged in successfully',
				_token: token,
			});
        } else {
            next(
                new ApiError(400, {
                    message: 'wrong password or user not found',
                })
            )
        } 
        }catch(error){
            return next(new ApiError(500, { message: error.message }));
    }
}

const register = async (req, res, next) => {
    try {
        const { email, password, confirmPassword, username,phone, role } = req.body;
        console.log(req.body)

        const saltRounds = 10;
		const hashedPassword = bcrypt.hashSync(password, saltRounds);
		const hashedConfirmPassword = bcrypt.hashSync(confirmPassword, saltRounds);
        
            const createUser = await users.create({
                username,
                email,
                phone,
                role,
                password:hashedPassword,
                confirmPassword:hashedConfirmPassword
            })
            res.status(201).json({
				status: true,
				message: 'user created successfully',
				data: {
						id: createUser.id,
						username: createUser.username,
						role: createUser.role,
                        phone: createUser.phone,
                        email:createUser.email,
						createdAt: createUser.createdAt,
						updatedAt: createUser.updatedAt,
				},
			});

    } catch (error) {
       return next(new ApiError(500, { message: error.message }));
    }
}
const getUserLoggedIn = async (req, res, next) => {

    try {
        const user = req.user;
		if (!user) return next(new ApiError(401, { message: 'Unauthorized' }));

        res.status(200).json({
            status: true,
            data: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    phone: user.phone,
                    email:user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                
                }
        })
    } catch (err) {
        return next(new ApiError(500, { message: err.message }));
    }
}

const getUserCalculationV = async (req, res, next) => {
    try{
        const allUserCalculation = await user_calculation_v.findAll();

        res.status(200).json({
            tatus: "Success",
            message: "All User Calculation successfully retrieved",
            data: { allUserCalculation },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

const getUserRegisterIn = async (req, res, next) => {

    try {

		const endUsers = await users.findAll({
        attributes: ['username', 'email', 'phone', 
            [sequelize.literal("TO_CHAR(\"createdAt\", 'DD-MM-YYYY')"), 'createdAtFormatted']
        ],
            where: {
                role: 'endUser'
            }
        });

        res.status(200).json({
            status: true,
            data: endUsers
        })
    } catch (err) {
        return next(new ApiError(500, { message: err.message }));
    }
}

module.exports = {
    login,
    register,
    getUserLoggedIn,
    getUserCalculationV,
    getUserRegisterIn
}