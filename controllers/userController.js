
const ApiError = require("../utils/apiError");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
// const { Sequelize } = require('sequelize');
const {users, user_calculation_v,sequelize } = require("../models")


// const login =  async (req, res, next) => {
//     try{
        
//         const { email, password} = req.body;
   
        


//         const findUser = await users.findOne({
//             where: {
//                 email,
//             }
//         })
//         if(!findUser){
//             return next(new ApiError("User not found",  400))
//         }
//         console.log("nyari user", findUser)

//         const isPasswordValid = bcrypt.compareSync(password, findUser.password);
//         if (!isPasswordValid) {
//             return next(new ApiError("Invalid email or password", 401));
//     }

//             const token = jwt.sign(
//                 { 
//                     user_id: findUser.id,
//                     username: findUser.username,
//                     role: findUser.role,
//                     email: findUser.email,
//                 },
//                 process.env.JWT_SECRET,
//                 {
// 					expiresIn: process.env.JWT_EXPIRED,
// 				}
//             )
//             console.log("tokennn", token)
//             return

//             console.log("Generated Token:", token);
            
//             res.cookie('_token', token, {
//                 httpOnly: true,
// 				maxAge: 24 * 60 * 60 * 100,
//             });

//             res.status(200).json({
// 				status: true,
// 				message: 'user logged in successfully',
// 				token: token  ,
// 			});
//         } else {
//             next(
//                 new ApiError(400, {
//                     message: 'wrong password or user not found',
//                 })
//             )
//         } 
//         }catch(error){
//             return next(new ApiError(500, { message: error.message }));
    
// }

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Mencari user berdasarkan email
        const findUser = await users.findOne({
            where: {
                email,
            }
        });

        if (!findUser) {
            return next(new ApiError("User tidak ditemukan", 400));
        }
        console.log("Mencari user", findUser);

        // Memeriksa validitas password
        const isPasswordValid = bcrypt.compareSync(password, findUser.password);
        if (!isPasswordValid) {
            return next(new ApiError("Email atau password tidak valid", 401));
        }

        // Membuat JWT token
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
        );

        console.log("Generated Token:", token);
        
        // Menetapkan cookie dengan token
        res.cookie('_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 jam
        });

        // Mengirim respons dengan token
        res.status(200).json({
            status: true,
            message: 'User berhasil login',
            token: token,
        });
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
};

const register = async (req, res, next) => {
    try {
        const { email, password, confirmPassword, username,phone, role } = req.body;
        // console.log(req.body)

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
            console.log(createUser)
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

const getProfile = async (req, res, next) => {
    try {
        const id = req.user.id; 
        console.log(req.user.id)
   
        const user = await users.findOne({
            where: {
                id, // Use the correct variable here
            }
        });

        if (!user) {
            return next(new ApiError(404, { message: 'User not found' }));
        }

        res.status(200).json({
            status: "Success",
            message: "Student data successfully retrieved",
            requestAt: req.requestTime,
            data:{ username:user.username}
          });
      
    } catch (error) {
        return next(new ApiError(500, { message: error.message }));
    }
};


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
    getProfile,
    getUserCalculationV,
    getUserRegisterIn
}