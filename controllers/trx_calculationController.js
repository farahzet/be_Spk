const {trx_calculations} = require("../models");
const ApiError = require("../utils/apiError");



const createCalculation = async (req, res, next) => {
    const {user_id, food_id, activity_id, weight, height, gender, age} = req.body;

    try {
        const data = {
            user_id, 
            food_id, 
            activity_id, 
            weight, 
            height, 
            gender, 
            age
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


module.exports = {
    createCalculation,
    getAllCalculation,
    updateCalculation,
    deletecalculation
}