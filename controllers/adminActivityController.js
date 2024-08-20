const {activities} = require("../models");
const ApiError = require("../utils/apiError");



const createActivity = async (req, res, next) => {
    const {activity_name, activity_level,bobot} = req.body;

    try {
        const data = {
            activity_name, 
            activity_level,
            bobot
        }
        console.log(data);
        const newActivity = await activities.create(data);

        res.status(201).json({
            status: "Success",
            message: "Activity successfully created",
            data: { newActivity },
        })
    }catch (err) {
        return next (new ApiError(err.message, 400))
    }
}

const getAllActivity = async (req, res, next) => {
    try{
        const allActivity = await activities.findAll();

        res.status(200).json({
            status: true,
            message: "All Activity successfully retrieved",
            data: { allActivity },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

const updateActivity = async (req, res, next) => {
    const {activity_name, activity_level,bobot} = req.body;

    try{
        const id = req.params.id;
        const findActivity = await activities.findOne({
            where: {
                id,
            }
        })
        if (!findActivity){
            return next (new ApiError(`Activity with id '${id}' not found`))
        }

        await activities.update({
            activity_name, 
            activity_level,
            bobot
        },
        {
            where: {
                id,
            }
        })

        const updateActivity = await activities.findOne({
            where: {
                id,
            }
        })

        res.status(200).json({
            status: "Success",
            message: "Activity Successfully Updated",
            requestAt : req.requestTime,
            data:{updateActivity}
        })
    }catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const deleteActivity = async (req, res, next) => {
    try {
        const id=req.params.id;

        const findActivity = await activities.findByPk(id)

        if (!findActivity){
            return next (new ApiError (`Activity with id '${id}' not found`))
        }

        await findActivity.destroy({
            where:{
                id: req.params.id,
            },
        })

        res.status(200).json({
            status: "Success",
            message: "Activity successfully deleted",
            requestAt: req.requestTime
        })
    } catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

module.exports = {
    createActivity,
    getAllActivity,
    updateActivity,
    deleteActivity
}