// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();


const {
    addMoneyTracker,
    deleteMoneyTracker,
    getDayData,
    getWeekData,
    getMonthData,
    deleteTodayTestData,
    refreshDataWithMonthAndYear,
} = require('./src/moneyTracker');
const {
    addMoneyType,
    findAllMoneyIncomeTypes,
    findAllMoneyLostTypes
} = require('./src/moneyTypes');

// 云函数入口函数
exports.main = async (request, context) => {
    const { type, date, data } = request;
    if (type === "day") {
        const { onlyMe } = request;
        return await getDayData(date, cloud, onlyMe);
    }
    if (type === "week") {
        const { onlyMe } = request;
        return await getWeekData(date, cloud, onlyMe);
    }
    if (type === "month") {
        const { onlyMe } = request;
        const { month, year } = date;
        return await getMonthData(year, month, cloud, onlyMe);
    }
    if (type === "remove-today-test") {
        return await deleteTodayTestData(cloud);
    }
    if (type === "money-types-lost") {
        return await findAllMoneyLostTypes(cloud);
    }
    if (type === "money-types-income") {
        return await findAllMoneyIncomeTypes(cloud);
    }
    if (type === "money-types-add") {
        return await addMoneyType(data, cloud);
    }
    if (type === "delete-money-tracker") {
        return await deleteMoneyTracker(data, cloud);
    }
    if (type === "add-money-tracer") {
        return await addMoneyTracker(data, cloud);
    }
    if (type === 'refreshDataWithMonthAndYear') {
        return await refreshDataWithMonthAndYear(data, cloud);
    }
    return [];
};
