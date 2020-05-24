// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();


const {
    addMoneyTracker,
    deleteMoneyTracker,
    getDayData,
    getWeekData,
    getMonthData,
    refreshDataWithMonthAndYear,
    findById,
    updateMoneyTracker
} = require('./src/moneyTracker');

const {
    addMoneyType,
    findAllMoneyIncomeTypes,
    findAllMoneyLostTypes
} = require('./src/moneyTypes');

// 云函数入口函数
// eslint-disable-next-line no-unused-vars
exports.main = async (request, context) => {
    const { type, date, data } = request;
    if (type === 'day') {
        const { onlyMe } = request;
        return await getDayData(date, cloud, onlyMe);
    }
    if (type === 'week') {
        const { onlyMe } = request;
        return await getWeekData(date, cloud, onlyMe);
    }
    if (type === 'month') {
        const { onlyMe } = request;
        const { month, year } = date;
        return await getMonthData(year, month, cloud, onlyMe);
    }
    if (type === 'money-types-lost') {
        return await findAllMoneyLostTypes(cloud);
    }
    if (type === 'money-types-income') {
        return await findAllMoneyIncomeTypes(cloud);
    }
    if (type === 'money-types-add') {
        return await addMoneyType(data, cloud);
    }
    if(type === 'update-money-tracer'){
        return await updateMoneyTracker(data, cloud);
    }
    if (type === 'delete-money-tracker') {
        return await deleteMoneyTracker(data, cloud);
    }
    if (type === 'add-money-tracer') {
        return await addMoneyTracker(data, cloud);
    }
    if (type === 'refreshDataWithMonthAndYear') {
        return await refreshDataWithMonthAndYear(data, cloud);
    }
    if(type === 'findById'){
        return await findById(data.id, cloud);
    }
    return [];
};
