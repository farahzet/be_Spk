const {trx_food_criteria, criteria, food, food_calculation_v} = require("../models");
const ApiError = require("../utils/apiError");
const sequelize = require('../models').sequelize;
const { transformCriteriaValues } = require ("../utils/cpi");

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


const FoodCriteria = async (req, res, next) => {
    const { food_code, food_name, food_desc, criteriaValues } = req.body;

    console.log("Received data:", req.body);

    if (!criteriaValues || typeof criteriaValues !== 'object' || Object.keys(criteriaValues).length === 0) {
        console.error("Invalid criteriaValues:", criteriaValues);
        return next(new ApiError('Invalid criteriaValues', 400));
    }

    const t = await sequelize.transaction();

    try {
        const newFood = await food.create({
            food_code,
            food_name,
            food_desc,
        }, { transaction: t });

        console.log("Created new food:", newFood);

        const criteriaDataArray = [];

        for (const [key, value] of Object.entries(criteriaValues)) {
            console.log("Processing entry:", key, value);
            const { criteria_name, calculation } = value;
            console.log("Processing criteria:", criteria_name, "with calculation:", calculation);
            
            if (!criteria_name || criteria_name === "0") {
                throw new Error(`Invalid criteria name: ${criteria_name}`);
            }

            const criteriaRecord = await criteria.findOne({ where: { criteria_name } }, { transaction: t });

            if (!criteriaRecord) {
                throw new Error(`Criteria with name ${criteria_name} not found`);
            }

            const newFoodCriteria = await trx_food_criteria.create({
                food_id: newFood.id,
                criteria_id: criteriaRecord.id,
                calculation,
            }, { transaction: t });

            console.log("Created new food criteria:", newFoodCriteria);

            criteriaDataArray.push({
                criteria_id: criteriaRecord.id,
                criteria_name: criteriaRecord.criteria_name,
                calculation: newFoodCriteria.calculation,
            });
        }

        await t.commit();

        res.status(201).json({
            status: true,
            message: "Food Criteria Created Successfully",
            data: {
                foodData: {
                    id: newFood.id,
                    name: newFood.food_name,
                    code: newFood.food_code,
                    description: newFood.food_desc,
                    createdAt: newFood.createdAt,
                    updatedAt: newFood.updatedAt,
                },
                criteriaValues: criteriaDataArray
            },
        });
    } catch (err) {
        await t.rollback();
        console.error("Error during transaction:", err);
        return next(new ApiError(err.message, 500));
    }
}


const getAllFoodCriteria = async (req, res, next) => {
    try {
        const foods = await food.findAll({
            include: [
                {
                    model: trx_food_criteria,
                    as: 'food_criteria',
                    include: [
                        {
                            model: criteria,
                            as: 'criteriaview'
                        }
                    ]
                }
            ]
        });

        // Format hasil query sesuai kebutuhan
        const formattedData = foods.map(foodItem => ({
            id: foodItem.id,
            food_code: foodItem.food_code,
            food_name: foodItem.food_name,
            food_desc: foodItem.food_desc,
            criteria_values: foodItem.food_criteria.map(criteriaItem => ({
                criteria_id: criteriaItem.criteriaview.id,
                criteria_name: criteriaItem.criteriaview.criteria_name,
                calculation: criteriaItem.calculation
            }))
        }));

        res.status(200).json({
            status: true,
            message: "Success",
            data: formattedData
        });
    } catch (err) {
        console.error("Error fetching food criteria data:", err);
        return next(new ApiError("Failed to fetch food criteria data", 500));
    }
};


const updateFoodCriteria = async (req, res, next) => {
    const { id } = req.params; 
    const { food_code, food_name, food_desc, criteriaValues } = req.body;

    console.log("Received data:", req.body);

    if (!criteriaValues || typeof criteriaValues !== 'object' || Object.keys(criteriaValues).length === 0) {
        console.error("Invalid criteriaValues:", criteriaValues);
        return next(new ApiError('Invalid criteriaValues', 400));
    }

    const t = await sequelize.transaction();

    try {
        const existingFood = await food.findByPk(id, { transaction: t });

        if (!existingFood) {
            throw new Error(`Food with id ${id} not found`);
        }

        await existingFood.update({
            food_code,
            food_name,
            food_desc,
        }, { transaction: t });

        console.log("Updated food:", existingFood);

        const criteriaDataArray = [];

        for (const [key, value] of Object.entries(criteriaValues)) {
            console.log("Processing entry:", key, value);
            const { criteria_name, calculation } = value;
            console.log("Processing criteria:", criteria_name, "with calculation:", calculation);

            if (!criteria_name || criteria_name === "0") {
                throw new Error(`Invalid criteria name: ${criteria_name}`);
            }

            const criteriaRecord = await criteria.findOne({ where: { criteria_name } }, { transaction: t });

            if (!criteriaRecord) {
                throw new Error(`Criteria with name ${criteria_name} not found`);
            }

            const existingFoodCriteria = await trx_food_criteria.findOne({
                where: {
                    food_id: id,
                    criteria_id: criteriaRecord.id,
                },
                transaction: t
            });

            if (existingFoodCriteria) {
                await existingFoodCriteria.update({
                    calculation,
                }, { transaction: t });

                console.log("Updated food criteria:", existingFoodCriteria);
            } else {
                const newFoodCriteria = await trx_food_criteria.create({
                    food_id: id,
                    criteria_id: criteriaRecord.id,
                    calculation,
                }, { transaction: t });

                console.log("Created new food criteria:", newFoodCriteria);
                criteriaDataArray.push({
                    criteria_id: criteriaRecord.id,
                    criteria_name: criteriaRecord.criteria_name,
                    calculation: calculation,
                });
            }
        }

        await t.commit();

        res.status(200).json({
            status: true,
            message: "Food Criteria Updated Successfully",
            data: {
                foodData: {
                    id: existingFood.id,
                    name: existingFood.food_name,
                    code: existingFood.food_code,
                    description: existingFood.food_desc,
                    createdAt: existingFood.createdAt,
                    updatedAt: existingFood.updatedAt,
                },
                criteriaValues: criteriaDataArray
            },
        });
    } catch (err) {
        await t.rollback();
        console.error("Error during transaction:", err);
        return next(new ApiError(err.message, 500));
    }
}



const deleteFoodCriteria = async (req, res, next) => {
    const { id } = req.params; 

    const t = await sequelize.transaction(); 

    try {
        const existingFood = await food.findByPk(id, { transaction: t });

        if (!existingFood) {
            throw new Error(`Food with id ${id} not found`);
        }

        await trx_food_criteria.destroy({
            where: {
                food_id: id,
            },
            transaction: t,
        });

        await existingFood.destroy({ transaction: t });

        await t.commit();

        res.status(200).json({
            status: true,
            message: "Food and associated criteria deleted successfully",
        });
    } catch (err) {
        // Rollback transaksi jika terjadi kesalahan
        await t.rollback();
        console.error("Error during transaction:", err);
        return next(new ApiError(err.message, 500));
    }
};


const getFoodCriteriaV = async (req, res, next) => {
    try{
        const allCalculationCriteria = await food_calculation_v.findAll();

        res.status(200).json({
            tatus: "Success",
            message: "All Calculation Criteria successfully retrieved",
            data: { allCalculationCriteria },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

const getAllFoodCriteriaCPI = async (req, res, next) => {
    try {
        const foods = await food.findAll({
            include: {
                model: trx_food_criteria,
                as: 'food_criteria',
                include: {
                    model: criteria,
                    as: 'criteriaview'
                }
            }
        });

        const criteriaCalculations = {};
        const criteriaBobot = {};
        foods.forEach(foodItem => {
            foodItem.food_criteria.forEach(criteriaItem => {
                const { criteriaview, calculation } = criteriaItem;
                const { criteria_name , bobot} = criteriaview;

                if (!criteriaCalculations[criteria_name]) {
                    criteriaCalculations[criteria_name] = [];
                }
                if (!criteriaBobot[criteria_name], bobot) {
                    criteriaBobot[criteria_name] = [];
                }

                criteriaCalculations[criteria_name].push(parseFloat(calculation));
                criteriaBobot[criteria_name].push(parseFloat(bobot));
            });
        });

        console.log("All criteria calculations:", criteriaCalculations);
        console.log("All criteria bobot:", criteriaBobot);

        const minCalculations = {};
        Object.keys(criteriaCalculations).forEach(criteria_name => {
            minCalculations[criteria_name] = Math.min(...criteriaCalculations[criteria_name]);
            console.log(`Minimum calculation for ${criteria_name}:`, minCalculations[criteria_name]);
        });

        const foodIndices = {};
        const formattedData = foods.map(foodItem => {
            const criteria_values = foodItem.food_criteria.map(criteriaItem => {
                const { criteriaview, calculation } = criteriaItem;
                const { criteria_name, tren, bobot } = criteriaview;

                let transformedCalculation;
                if (tren === 'Positif') {
                    transformedCalculation = (calculation / minCalculations[criteria_name]) * 100;
                    console.log(`Transformed calculation tren positif [for ${criteria_name}:`, transformedCalculation);
                } else if (tren === 'Negatif') {
                    transformedCalculation = (minCalculations[criteria_name] / calculation) * 100;
                    console.log(`Transformed calculation (tren negatif for ${criteria_name}:`, transformedCalculation);
                } else {
                    transformedCalculation = calculation;
                    console.log(`No tren defined for ${criteria_name} :`, transformedCalculation);
                }

                const alternativeIndex = transformedCalculation * parseFloat(bobot);
                if (!foodIndices[foodItem.id]) {
                    foodIndices[foodItem.id] = 0;
                }

                foodIndices[foodItem.id] += alternativeIndex;

                return {
                    criteria_id: criteriaview.id,
                    criteria_name: criteria_name,
                    calculation: transformedCalculation
                };
            });

            return {
                id: foodItem.id,
                food_code: foodItem.food_code,
                food_name: foodItem.food_name,
                food_desc: foodItem.food_desc,
                criteria_values
            };
        });

        console.log("Formatted data:", formattedData);
        console.log("Food indices:", foodIndices);

        res.status(200).json({
            status: true,
            message: "Food Criteria Fetched Successfully",
            data: { formattedData, foodIndices }
        });
    } catch (err) {
        console.error("Error fetching food criteria:", err);
        return next(new ApiError(err.message, 500));
    }
};


const getAllFoodBobotScore = async (req, res, next) => {
    try {
        const foods = await food.findAll({
            include: {
                model: trx_food_criteria,
                as: 'food_criteria',
                include: {
                    model: criteria,
                    as: 'criteriaview',
                }
            }
        })
        
    } catch (error) {
        
    }
}


module.exports = {
    createFoodCriteria,
    getAllFoodCriteria,
    updateFoodCriteria,
    deleteFoodCriteria,
    FoodCriteria,
    getFoodCriteriaV,
    getAllFoodCriteriaCPI
}