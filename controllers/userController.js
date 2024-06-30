
const ApiError = require("../utils/apiError");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const {users} = require("../models")

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

// const createUser = async (req, res, next) => {
//     const {username, email, password, phone} = req.body;

//     try {
//         const data = {
//             username, 
//             email, 
//             password, 
//             phone
//         }
//         console.log(data);
//         const newUser = await users.create(data);

//         res.status(201).json({
//             status: "Success",
//             message: "Activity successfully created",
//             data: { newUser },
//         })
//     }catch (err) {
//         return next (new ApiError(err.message, 400))
//     }
// }
// const getAllUser = async (req, res, next) => {
//     try{
//         const allUser = await users.findAll();

//         res.status(200).json({
//             tatus: "Success",
//             message: "All User successfully retrieved",
//             data: { allUser },
//         });
//     }catch (err){
//         return next (new ApiError(err.message, 400))
//     }
// }
// const updateActivity = async (req, res, next) => {
//     const {username, email, password, phone} = req.body;

//     try{
//         const id = req.params.id;
//         const findUser = await users.findOne({
//             where: {
//                 id,
//             }
//         })
//         if (!findUser){
//             return next (new ApiError(`User with id '${id}' not found`))
//         }

//         await users.update({
//             username, 
//             email, 
//             password, 
//             phone
//         },
//         {
//             where: {
//                 id,
//             }
//         })

//         const updateUser = await users.findOne({
//             where: {
//                 id,
//             }
//         })

//         res.status(200).json({
//             status: "Success",
//             message: "User Successfully Updated",
//             requestAt : req.requestTime,
//             data:{updateUser}
//         })
//     }catch (err) {
//         return next (new ApiError (err.message, 400))
//     }

// const deleteActivity = async (req, res, next) => {
//     try {
//         const id=req.params.id;

//         const findUser = await users.findByPk(id)

//         if (!findUser){
//             return next (new ApiError (`User with id '${id}' not found`))
//         }

//         await findUser.destroy({
//             where:{
//                 id: req.params.id,
//             },
//         })

//         res.status(200).json({
//             status: "Success",
//             message: "User successfully deleted",
//             requestAt: req.requestTime
//         })
//     } catch (err) {
//         return next (new ApiError (err.message, 400))
//     }
// }

module.exports = {
    login,
    register,
    getUserLoggedIn,
    // createUser,
    // getAllUser,
    // updateActivity,
    // deleteActivity
}