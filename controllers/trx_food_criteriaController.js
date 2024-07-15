const {trx_food_criteria, criteria, food, food_calculation_v} = require("../models");
const ApiError = require("../utils/apiError");
const sequelize = require('../models').sequelize;

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
    // try {
    //     const {food_code, food_name, criteria_name, food_desc} = req.body;

    //     const newFood = await food.create({
    //         food_code,
    //         food_name,
    //         food_desc,
    //     })

    //     const newCriteria = await criteria.create({
    //         criteria_name
    //     })

    //     await trx_food_criteria.create({
    //         food_id: newFood.id,
    //         criteria_id: newCriteria.id,
    //     })

    //     res.status(201).json({
    //         status: true,
    //         message: "Food Criteria Created Successfully",
    //         data:{
    //             foodData:{
    //                 id: newFood.id,
    //                 name: newFood.food_name,
    //                 code: newFood.food_code,
    //                 description: newFood.food_desc,
    //                 createdAt: newFood.createdAt,
    //                 updatedAt: newFood.updatedAt, 
    //             },

    //             criteriaData:{
    //                 id: newCriteria.id,
    //                 nameCriteria: newCriteria.crieria_name,
    //                 createdAt: newCriteria.createdAt,
    //                 updatedAt: newCriteria.updatedAt,
    //             }
    //         },
    //     })
    // } catch (err) {
    //     return next (new ApiError(err.message, 500));
    // }

    const { food_code, food_name, food_desc, criteria_values } = req.body;

    console.log("Received data:", req.body);

    const t = await sequelize.transaction();

    try {
        const newFood = await food.create({
            food_code,
            food_name,
            food_desc,
        }, { transaction: t });

        console.log("Created new food:", newFood);

        const criteriaDataArray = [];

        for (const [criteria_name, calculation] of Object.entries(criteria_values)) {
            console.log("Processing criteria:", criteria_name, "with calculation:", calculation);

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

// const getAllFoodCriterias = async (req, res, next) => {
//     try {
//         const allFoodCriteria = await trx_food_criteria.findAll({
//             include: [
//                 {
//                     model: food,
//                     as: 'food_criteria',
//                 },
//                 {
//                     model: criteria,
//                     as: 'criteriaview',
//                 },
//             ],
//         });

//         res.status(200).json({
//             status: "Success",
//             message: "All Food Criteria successfully retrieved",
//             data: { allFoodCriteria },
//         });
//     } catch (err) {
//         return next(new ApiError(err.message, 400));
//     }
// }

const getAllFoodCriteria = async (req, res, next) => {
    try {
        // Ambil semua data makanan beserta kriteria terkait menggunakan eager loading
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


module.exports = {
    createFoodCriteria,
    getAllFoodCriteria,
    updateFoodCriteria,
    deleteFoodCriteria,
    FoodCriteria,
    getFoodCriteriaV
}