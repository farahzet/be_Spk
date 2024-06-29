const {trx_food_criteria} = require("../models");
const ApiError = require("../utils/apiError");


const createFoodCriteria = async (req, res, next) => {
    const { food_id, criteria_id, calculation} = req.body;

    try {
        const data = { 
            food_id, 
            criteria_id, 
            calculation
        }
        console.log(data);
        const newFoodCriteria = await trx_food_criteria.create(data);

        res.status(201).json({
            status: "Success",
            message: "Food Criteria successfully created",
            data: { newFoodCriteria },
        })
    }catch (err) {
        return next (new ApiError(err.message, 400))
    }
}

const getAllFoodCriteria = async (req, res, next) => {
    try{
        const allFoodCriteria = await trx_food_criteria.findAll();

        res.status(200).json({
            tatus: "Success",
            message: "All Food Criteria successfully retrieved",
            data: { allFoodCriteria },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

const updateFoodCriteria = async (req, res, next) => {
    const { food_id, criteria_id, calculation} = req.body;
    try{
        const id = req.params.id;
        const findFoodCriteria = await trx_food_criteria.findOne({
            where: {
                id,
            }
        })
        if (!findFoodCriteria){
            return next (new ApiError(`FoodCriteria with id '${id}' not found`))
        }

        await trx_food_criteria.update({
            food_id, criteria_id, calculation
        },
        {
            where: {
                id,
            }
        })

        const updateFoodCriteria = await trx_food_criteria.findOne({
            where: {
                id,
            }
        })

        res.status(200).json({
            status: "Success",
            message: "FoodCriteria Successfully",
            requestAt : req.requestTime,
            data:{updateFoodCriteria}
        })
    }catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const deleteFoodCriteria = async (req, res, next) => {
    try {
        const id=req.params.id;

        const findFoodCriteria = await trx_food_criteria.findByPk(id)

        if (!findFoodCriteria){
            return next (new ApiError (`FoodCriteria with id '${id}' not found`))
        }

        await findFoodCriteria.destroy({
            where:{
                id: req.params.id,
            },
        })

        res.status(200).json({
            status: "Success",
            message: "FoodCriteria successfully deleted",
            requestAt: req.requestTime
        })
    } catch (err) {
        return next (new ApiError (err.message, 400))
    }
}


module.exports = {
    createFoodCriteria,
    getAllFoodCriteria,
    updateFoodCriteria,
    deleteFoodCriteria
}