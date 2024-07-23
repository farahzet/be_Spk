const {trx_calculations, food_calculation_v, activities} = require("../models");
const ApiError = require("../utils/apiError");



const createCalculation = async (req, res, next) => {
    const {user_id, activity_id, weight, height, gender, age, calories_score} = req.body;
    

    try {
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

        const activityUser = parseFloat(activityData.bobot);
        if (isNaN(activityUser)) {
            return next (new ApiError(`Invalid activity bobot value`))
            
        }



        let totalCalories = kaloriBasal + (activityUser * kaloriBasal);

        if (age > 40 && age < 60) {
            totalCalories -= totalCalories * 0.05;
        } else if (age >= 60 && age <= 69) {
            totalCalories -= totalCalories * 0.10;
        } else if (age > 69) {
            totalCalories -= totalCalories * 0.20; 
        }

        const data = {
            user_id, 
            activity_id, 
            weight, 
            height, 
            gender, 
            age,
            kalori_basal: kaloriBasal,
            activityuser : activityUser,
            calories_score: totalCalories
        }
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
    getAllFoodCalculation
}