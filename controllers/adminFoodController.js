const {food} = require("../models");
const {criteria, sequelize} = require("../models");
const ApiError = require("../utils/apiError");


const createFood = async (req, res, next) => {
    const {food_code, food_name,food_desc} = req.body;
    try {
        const data = {
            food_code,
            food_name,
            food_desc,
        }
        console.log(data);
        const newFood = await food.create(data);

        res.status(201).json({
            status: "Success",
            message: "Food successfully created",
            data: { newFood },
        })
    }catch (err) {
        return next (new ApiError(err.message, 400))
    }
}

const getAllFood = async (req, res, next) => {
    try{
        const allFood = await food.findAll();

        res.status(200).json({
            status: "Success",
            message: "All Food successfully retrieved",
            data: { allFood },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

const updateFood = async (req, res, next) => {
    const {food_code, food_name, food_desc} = req.body;
    try{
        const id = req.params.id;
        const findFood = await food.findOne({
            where: {
                id,
            }
        })
        if (!findFood){
            return next (new ApiError(`Food with id '${id}' not found`))
        }

        await food.update({
            food_code,
            food_name,
            food_name
        },
        {
            where: {
                id,
            }
        })

        const updateFood = await food.findOne({
            where: {
                id,
            }
        })

        res.status(200).json({
            status: "Success",
            message: "Food Successfully",
            requestAt : req.requestTime,
            data:{updateFood}
        })
    }catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const deleteFood = async (req, res, next) => {
    try {
        const id=req.params.id;

        const findFood = await food.findByPk(id)

        if (!findFood){
            return next (new ApiError (`Food with id '${id}' not found`))
        }

        await findFood.destroy({
            where:{
                id: req.params.id,
            },
        })

        // await findFood.destroy();

        res.status(200).json({
            status: "Success",
            message: "Food successfully deleted",
            requestAt: req.requestTime
        })
    } catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const getTableName = async (req, res, next) => {
    try {
        const foodAttributes = ['food_code', 'food_name', 'food_desc'];
        const criteriaAttributes = await criteria.findAll({ attributes: ['criteria_name'] });

        const criteriaNames = criteriaAttributes.map(attr => attr.criteria_name);

        res.json({
            data: {
                food: foodAttributes,
                criteria: criteriaNames,
            },
        });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
}

const getTableNameScore = async (req, res, next) => {
    try {
        const foodAttributes = ['id', 'food_name', 'food_desc'];
        const criteriaAttributes = await criteria.findAll({ attributes: ['criteria_name'] });

        const criteriaNames = criteriaAttributes.map(attr => attr.criteria_name);

        res.json({
            data: {
                food: foodAttributes,
                criteria: criteriaNames,
            },
        });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
}




module.exports = {
    createFood,
    getAllFood,
    updateFood,
    deleteFood,
    getTableName,
    getTableNameScore
}