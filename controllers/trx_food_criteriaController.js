const {trx_food_criteria, criteria, food, food_calculation_v} = require("../models");
const ApiError = require("../utils/apiError");
const sequelize = require('../models').sequelize;
const { transformCriteriaValues } = require ("../utils/cpi");
const { Op, Sequelize } = require("sequelize");

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
    const { food_code, food_name, food_desc, food_calories, criteriaValues } = req.body;

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
            food_calories,
        }, { transaction: t });

        console.log("Created new food:", newFood);

        const criteriaDataArray = [];

        for (const [key, value] of Object.entries(criteriaValues)) {
            console.log("Processing entry:", key, value);
            const { criteria_name, calculation } = value;
            console.log("Processing criteria:", criteria_name, "with calculation:", calculation);
            
            if (!criteria_name || criteria_name === "0") {
                return next(new ApiError(`Invalid criteria name: ${criteria_name}`));
            }

            const criteriaRecord = await criteria.findOne({ where: { criteria_name } }, { transaction: t });

            if (!criteriaRecord) {
                return next(new ApiError(`Criteria with name ${criteria_name} not found`));
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
                    calories: newFood.food_calories,
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
            food_calories: foodItem.food_calories,
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
    const { food_code, food_name, food_desc, food_calories, criteriaValues } = req.body;

    console.log("Received data:", req.body);

    if (!criteriaValues || typeof criteriaValues !== 'object' || Object.keys(criteriaValues).length === 0) {
        console.error("Invalid criteriaValues:", criteriaValues);
        return next(new ApiError('Invalid criteriaValues'));
    }

    const t = await sequelize.transaction();

    try {
        const existingFood = await food.findByPk(id, { transaction: t });

        if (!existingFood) {
            return next(new ApiError(`Food with id ${id} not found`));
        }

        await existingFood.update({
            food_code,
            food_name,
            food_desc,
            food_calories,
        }, { transaction: t });

        console.log("Updated food:", existingFood);

        const criteriaDataArray = [];

        for (const [key, value] of Object.entries(criteriaValues)) {
            console.log("Processing entry:", key, value);
            const { criteria_name, calculation } = value;
            console.log("Processing criteria:", criteria_name, "with calculation:", calculation);

            if (!criteria_name || criteria_name === "0") {
                return next(new ApiError(`Invalid criteria name: ${criteria_name}`));
            }

            const criteriaRecord = await criteria.findOne({ where: { criteria_name } }, { transaction: t });

            if (!criteriaRecord) {
                return next(new ApiError(`Criteria with name ${criteria_name} not found`));
                
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
            return next(new ApiError(`Food with id ${id} not found`));
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
        // console.log("DATA :",foods)

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

        // console.log("All criteria calculations:", criteriaCalculations);
        // console.log("All criteria bobot:", criteriaBobot);


        const minCalculations = {};
        Object.keys(criteriaCalculations).forEach(criteria_name => {
            minCalculations[criteria_name] = Math.min(...criteriaCalculations[criteria_name]); 
            // console.log(`Minimum calculation for ${criteria_name}:`, minCalculations[criteria_name]);
        });


        const FoodDataScore = foods.map(async foodItem => {
            let final_score = 0;
            const criteria_values = await Promise.all(foodItem.food_criteria.map(async criteriaItem => {
                const { criteriaview, calculation } = criteriaItem;
                const { criteria_name, tren, bobot } = criteriaview;

                let transformedCalculation;
                if (tren === 'Positif') {
                    transformedCalculation = (calculation / minCalculations[criteria_name]) * 100;
                    // console.log(`Transformed calculation tren positif [for ${criteria_name}:`, transformedCalculation);
                } else if (tren === 'Negatif') {
                    transformedCalculation = (minCalculations[criteria_name] / calculation) * 100;
                    // console.log(`Transformed calculation (tren negatif for ${criteria_name}:`, transformedCalculation);
                } else {
                    transformedCalculation = calculation;
                    // console.log(`No tren defined for ${criteria_name} :`, transformedCalculation);
                }

                await trx_food_criteria.update(
                    { calculation_tren: transformedCalculation },
                    { where: { id: criteriaItem.id } }
                );

                // const alternativeIndex = transformedCalculation * parseFloat(bobot);
                // if (!foodIndices[foodItem.id]) {
                //     foodIndices[foodItem.id] = 0;
                // }

                // foodIndices[foodItem.id] += alternativeIndex;
                const bobotAlternative = transformedCalculation * parseFloat(bobot);
                final_score += bobotAlternative;

                console.log("transformedCalculation:", transformedCalculation);
                console.log("bobot:", bobot);
                console.log("bobotAlternative:", bobotAlternative);
                console.log("final_score:", final_score);
                

                // const rankingAllFood = total_score;
                // score_rank.sort((a, b) => b - a);
                // console.log("ranking" , rankingAllFood)
                

                return {
                    criteria_id: criteriaview.id,
                    criteria_name: criteria_name,
                    calculation_tren: transformedCalculation
                };
            }));

            await trx_food_criteria.update(
                { total_score: final_score },
                { where: { food_id: foodItem.id } }
            );

            return {
                id: foodItem.id,
                food_code: foodItem.food_code,
                food_name: foodItem.food_name,
                food_desc: foodItem.food_desc,
                criteria_values,
                total_score: final_score,
                
            };

        });

        const resolvedFoodDataScore = await Promise.all(FoodDataScore);

        FoodDataScore.sort((a, b) => b.total_score - a.total_score);


        await Promise.all(FoodDataScore.map(async (foodItem, index) => {
            foodItem.rank = index + 1;
        
            if (foodItem.id) {
                await trx_food_criteria.update(
                    { rank: foodItem.rank },
                    { where: { food_id: foodItem.id } }
                );
            } else {
                console.error('foodItem.id is undefined during rank update for:', foodItem);
            }
        }));

        res.status(200).json({
            status: true,
            message: "Food Criteria Fetched Successfully",
            data: resolvedFoodDataScore 
        });
    } catch (err) {
        // console.error("Error fetching food criteria:", err);
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

const getRank = async (req, res, next) => {
    try {
        const allRanks = await trx_food_criteria.findAll({
            order: [["total_score", "DESC"]],
        });

        if (allRanks.length === 0) {
            return res.status(200).json({
                status: "Success",
                message: "No data available",
                data: []
            });
        }

        // ngitung total entri
        const totalEntries = allRanks.length;
        // itung ukuran tiap kelompok
        const rank = Math.ceil(totalEntries / 3);

        // atur peringkat
        let currentRank = 1;
        let currentGroup = 1;

        const rankMap = new Map();

        for (let i = 0; i < allRanks.length; i++) {
            if (i > 0 && i % rank === 0) {
                // Pindah ke kelompok rank lain jika ukuran kelompok trcapai
                currentGroup++;
                currentRank = currentGroup; // Set peringkat sesuai dengan kelompok pringkat 123
            }
            // Simpan pemetaan id -> rank
            rankMap.set(allRanks[i].id, currentRank);
        }

        // Update peringkat pada entri
        const updatePromises = allRanks.map(score => {
            return score.update({ rank: rankMap.get(score.id) });
        });

        await Promise.all(updatePromises);

        res.status(200).json({
            status: "Success",
            message: "Filtering Success",
            data: allRanks.map(score => ({
                id: score.id,
                total_score: score.total_score,
                rank: score.rank
            }))
        });

    } catch (err) {
        return next(new ApiError(err.message, 400));
    }
};

module.exports = {
    getRank
};


module.exports = {
    createFoodCriteria,
    getAllFoodCriteria,
    updateFoodCriteria,
    deleteFoodCriteria,
    FoodCriteria,
    getFoodCriteriaV,
    getAllFoodCriteriaCPI,
    getRank
    
}