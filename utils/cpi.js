const calculateCPI = async () => {
    try {
        const allCriteria = await criteria.findAll();
        
        const allFoodCriteria = await trx_food_criteria.findAll();
        
        const transformedValues = {};
    
        for (let criteriaValue of allCriteria) {
        const critValues = allFoodCriteria
            .filter(fc => fc.criteria_id === criteriaValue.id)
            .map(fc => fc.calculation);
    
        const minValue = Math.min(...critValues);
    
        transformedValues[criteriaValue.id] = critValues.map(value => {
            if (criteriaValue.tren === 'positif') {
            return (value / minValue) * 100;
            } else if (criteriaValue.tren === 'negatif') {
            return (minValue / value) * 100;
            }
        });
        }
    
        const foodIndices = {};
    
        for (let foodCrit of allFoodCriteria) {
        const crit = await criteria.findByPk(foodCrit.criteria_id);
        const transformedValue = transformedValues[foodCrit.criteria_id][foodCrit.food_id - 1]; 
        const alternativeIndex = transformedValue * parseFloat(crit.bobot);
    
        if (!foodIndices[foodCrit.food_id]) {
            foodIndices[foodCrit.food_id] = 0;
        }
    
        foodIndices[foodCrit.food_id] += alternativeIndex;
        }
    
        // Menampilkan hasil
        console.log('Nilai Indeks Gabungan untuk setiap makanan:');
        for (let foodId in foodIndices) {
        console.log(`Food ID: ${foodId}, Indeks Gabungan: ${foodIndices[foodId]}`);
        }
    } catch (error) {
        console.error('Error calculating composite performance index:', error);
    }
}

const transformCriteriaValues = (criteriaValues) => {
    // Pisahkan nilai berdasarkan kriteria tren positif dan negatif
    const positiveTrends = criteriaValues.filter(c => c.trend === 'positive');
    const negativeTrends = criteriaValues.filter(c => c.trend === 'negative');

    // Temukan nilai minimum untuk masing-masing tren
    const minPositiveValue = Math.min(...positiveTrends.map(c => c.calculation));
    const minNegativeValue = Math.min(...negativeTrends.map(c => c.calculation));

    // Transformasi nilai berdasarkan tren positif
    const transformedPositiveTrends = positiveTrends.map(c => ({
        ...c,
        calculation: (c.calculation / minPositiveValue) * 100
    }));

    // Transformasi nilai berdasarkan tren negatif
    const transformedNegativeTrends = negativeTrends.map(c => ({
        ...c,
        calculation: (minNegativeValue / c.calculation) * 100
    }));

    // Gabungkan hasil transformasi
    return [...transformedPositiveTrends, ...transformedNegativeTrends];
};


module.exports = {
    transformCriteriaValues
}