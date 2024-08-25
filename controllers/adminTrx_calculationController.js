const {trx_calculations, food_calculation_v, activities} = require("../models");
const ApiError = require("../utils/apiError");



const getActivityIdByName = async (activity_name) => {
    const activity = await activities.findOne({ where: { activity_name } });
    if (!activity) {
        throw new Error(`Invalid activity name: ${activity_name}`);
    }
    return activity.id;
};

const createCalculation = async (req, res, next) => {
    const {activity_name, weight, height, gender, age, food_id, calories, calories_score} = req.body;
    const user_id = req.user.id;

    try {
        const activity_id = await getActivityIdByName(activity_name);
        const activityData = await activities.findOne({ where: { id: activity_id } });

        if (!activityData) {
            return next (new ApiError(`Invalid activity ID`))
        }

        const heightInMeters = height / 100;
        const imt = weight / (heightInMeters ** 2);

        const heightMinus100 = height - 100;
        const bbi = heightMinus100 - (0.1 * heightMinus100);

        let kaloriBasal;
        if (gender === 'male') {
            kaloriBasal = bbi * 30;
        } else if (gender === 'female') {
            kaloriBasal = bbi * 25;
        } else {
            return next (new ApiError(`Invalid gender value`))
        }

        let score_age;
        if (age > 40 && age < 60) {
            score_age = kaloriBasal - ( kaloriBasal * 0.05);
        } else if (age >= 60 && age <= 69) {
            score_age = kaloriBasal - ( kaloriBasal * 0.10);
        } else if (age >= 70) {
            score_age = kaloriBasal - ( kaloriBasal * 0.20);
        } else {
            return next(new ApiError(`Invalid age_scrore value`));
        }

        const activityUser = parseFloat(activityData.bobot);
        if (isNaN(activityUser)) {
            return next (new ApiError(`Invalid activity bobot value`))
            
        }

        let totalCalories = score_age + (activityUser * score_age);


        // let caloriesUser;
        // if (calories === 'Puasa' || calories === 'ICU') {
        //     caloriesUser = totalCalories + 0.1 * totalCalories;
        // } else if (calories === 'Demam') {
        //     caloriesUser = totalCalories + 0.15 * totalCalories;
        // } else if (calories === 'Gagal Jantung') {
        //     caloriesUser = totalCalories + 0.2 * totalCalories;
        // } else if (calories === 'Sepsis') {
        //     caloriesUser = totalCalories + 0.25 * totalCalories;
        // } else if (calories === 'Luka Bakar') {
        //     caloriesUser = totalCalories + 0.3 * totalCalories;
        // } else {
        //     return next(new ApiError('Invalid calories value'));
        // }

        let caloriesUser;
        if (calories === 'Stress Ringan') {
            caloriesUser = totalCalories + 0.05 * totalCalories;
        } else if (calories === 'Stress Sedang') {
            caloriesUser = totalCalories + 0.1 * totalCalories;
        } else if (calories === 'Stress Berat') {
            caloriesUser = totalCalories + 0.2 * totalCalories;
        } else if (calories === 'Stress Sangat Berat') {
            caloriesUser = totalCalories + 0.25 * totalCalories;
        } else {
            return next(new ApiError('Invalid calories value'));
        }

        caloriesUser = parseFloat(caloriesUser.toFixed(2));

        const data = {
            user_id,
            activity_id,
            weight,
            height,
            gender,
            age,
            calories, // Ensure calories is included in the data object
            food_id,
            kalori_basal: kaloriBasal,
            scoreAge : score_age,
            activityuser: activityUser,
            total_cal: totalCalories,
            calories_score: caloriesUser
        };
        console.log(data);
        const newCalculation = await trx_calculations.create(data);

        res.status(201).json({
            status: "Success",
            message: "Calculation successfully created",
            data: { newCalculation },
        })
    }catch (err) {
        return next (new ApiError(err.message, 400))
    }
}

const getAllCalculation = async (req, res, next) => {
    try{
        const allCalculation = await trx_calculations.findAll();

        res.status(200).json({
            tatus: "Success",
            message: "All Calculation successfully retrieved",
            data: { allCalculation },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

const getSemuaData = async (req, res, next) => {
    const user_id = req.user.id;

    try {
        // Fetch all calculations for the logged-in user
        const calculations = await trx_calculations.findAll({
            where: { user_id },
            
        });

        // Check if the user has any calculations
        if (!calculations.length) {
            return res.status(404).json({
                status: "Fail",
                message: "No calculations found for the user"
            });
        }

        const formattedCalculations = calculations.map(calc => {
            return {
                ...calc.get(), // Retrieve the plain object representation
                createdAt: calc.createdAt.toLocaleDateString('en-GB') // Format to DD/MM/YYYY
            };
        });

        // Respond with the calculations
        res.status(200).json({
            status: "Success",
            message: "Data retrieved successfully",
            data: formattedCalculations
        });
    } catch (err) {
        return next(new ApiError(err.message, 500));
    }
}


const findDataCaloriesCalculationById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const findData = await trx_calculations.findOne({
            where: {
                id,
            }
        });
        if (!findData) {
            return next(new ApiError(`Calculation with id '${id}' not found`));
        }
        // Pastikan totalCalories ada di sini
        res.status(200).json({
            status: "Success",
            message: "Calculation Successfully",
            requestAt: req.requestTime,
            data: { 
                totalCalories: findData.calories_score // Ubah ke properti yang sesuai
            }
        });
    } catch (err) {
        return next(new ApiError(err.message, 400));
    }
};


const findDataCalcuationById= async (req, res, next) => {
    try {
        const user_id = req.params.id;
        console.log("user idnya apa sayanggg", user_id)

        // Find all calculations by user_id
        const calculations = await trx_calculations.findAll({
            where: {
                user_id,
            }
        });
        console.log("datanya banyak gaa, harus banyak sih", calculations)

        if (!calculations.length) {
            return next(new ApiError(`No calculations found for user with id '${user_id}'`, 404));
        }
        res.status(200).json({
            status: "Success",
            message: "Calculations retrieved successfully",
            requestAt: req.requestTime,
            data: calculations
        });
    } catch (err) {
        return next(new ApiError(err.message, 400));
    }
};


const updateCalculation = async (req, res, next) => {
    const {user_id, food_id, activity_id, weight, height, gender, age} = req.body;
    try{
        const id = req.params.id;
        const findCalculation = await trx_calculations.findOne({
            where: {
                id,
            }
        })
        if (!findCalculation){
            return next (new ApiError(`Calculation with id '${id}' not found`))
        }

        await trx_calculations.update({
            user_id, 
            food_id, 
            activity_id, 
            weight, 
            height, 
            gender, 
            age
        },
        {
            where: {
                id,
            }
        })

        const updateCalculation = await trx_calculations.findOne({
            where: {
                id,
            }
        })

        res.status(200).json({
            status: "Success",
            message: "Calculation Successfully",
            requestAt : req.requestTime,
            data:{updateCalculation}
        })
    }catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const deletecalculation = async (req, res, next) => {
    try {
        const id=req.params.id;

        const findCalculation = await trx_calculations.findByPk(id)

        if (!findCalculation){
            return next (new ApiError (`Calculation with id '${id}' not found`))
        }

        await findCalculation.destroy({
            where:{
                id: req.params.id,
            },
        })

        res.status(200).json({
            status: "Success",
            message: "Calculation successfully deleted",
            requestAt: req.requestTime
        })
    } catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const getAllFoodCalculation = async (req, res, next) => {
    try{
        const allFoodCalculation = await food_calculation_v.findAll();

        res.status(200).json({
            tatus: "Success",
            message: "All Food Calculation successfully retrieved",
            data: { allFoodCalculation },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

module.exports = {
    createCalculation,
    getAllCalculation,
    updateCalculation,
    deletecalculation,
    getAllFoodCalculation,
    findDataCalcuationById,
    findDataCaloriesCalculationById,
    getSemuaData,
}