const {criteria} = require("../models");
const ApiError = require("../utils/apiError");


const createCriteria = async (req, res, next) => {
    const {criteria_code, criteria_name, bobot, tren} = req.body;

    try {
        const data = {
            criteria_code,
            criteria_name,
            bobot,
            tren,
        }
        console.log(data);
        const newCriteria = await criteria.create(data);

        res.status(201).json({
            status: "Success",
            message: "Criteria successfully created",
            data: { newCriteria },
        })
    }catch (err) {
        return next (new ApiError(err.message, 400))
    }
}

const getAllCriteria = async (req, res, next) => {
    try{
        const allCriteria = await criteria.findAll();

        res.status(200).json({
            status: true,
            message: "All Criteria successfully retrieved",
            data: { allCriteria },
        });
    }catch (err){
        return next (new ApiError(err.message, 400))
    }
}

const updateCrireia = async (req, res, next) => {
    const {criteria_code, criteria_name, bobot, tren} = req.body;

    try{
        const id = req.params.id;
        const findCriteria = await criteria.findOne({
            where: {
                id
            }
        })
        if (!findCriteria){
            return next (new ApiError(`Criteria with id '${id}' not found`, 400))
        }

        await criteria.update({
            criteria_code, 
            criteria_name, 
            bobot, 
            tren
        },
        {
            where: {
                id
            }
        })

        const updateCriteria = await criteria.findOne({
            where: {
                id
            }
        })
        console.log("Data criteria berhasil diperbarui:", updateCriteria);

        res.status(200).json({
            status: "Success",
            message: "criteria Successfully Updated",
            requestAt : req.requestTime,
            data:{updateCriteria}
        })
    }catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const deleteCriteria = async (req, res, next) => {
    try {
        const id=req.params.id;

        const findCriteria = await criteria.findByPk(id)

        if (!findCriteria){
            return next (new ApiError (`Criteria with id '${id}' not found`))
        }

        await findCriteria.destroy({
            where:{
                id: req.params.id,
            },
        })

        res.status(200).json({
            status: "Success",
            message: "Criteria successfully deleted",
            requestAt: req.requestTime
        })
    } catch (err) {
        return next (new ApiError (err.message, 400))
    }
}

const getFormName = async (req, res, next) => {
    try {
        const criteriaNames = await criteria.findAll({ attributes: ['id', 'criteria_name'] });


        res.json({
            data: {
                criteria: criteriaNames,
            },
        });
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
}

const getCriteriaForThead = async (req, res, next) => {
    try {
        const criteriaData = await criteria.findAll({
            attributes: ['criteria_code', 'criteria_name', 'tren', 'bobot']
          });
      
          // Mengubah nilai tren
          criteriaData = criteriaData.map(criterion => {
            if (criterion.tren === 'Positif') {
              criterion.tren = '+';
            } else if (criterion.tren === 'Negatif') {
              criterion.tren = '-';
            }
            return criterion;
          });
      
          res.json(criteriaData);
        } catch (error) {
          res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    createCriteria,
    getAllCriteria,
    updateCrireia,
    deleteCriteria,
    getFormName,
    getCriteriaForThead
}