// 云函数入口文件
const cloud = require('wx-server-sdk');
const {
    addMoneyTracker,
    deleteMoneyTracker,
    getDayData,
    getWeekData,
    deleteTodayTestData,
    refreshDataWithMonthAndYear
} = require('./moneyTracker');
const {
    addMoneyType,
    findAllMoneyIncomeTypes,
    findAllMoneyLostTypes
} = require('./moneyTypes');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type, date, data } = event;
    if (type === "day") {
        return await getDayData(date, cloud);
    }
    if (type === "week") {
        return await getWeekData(date, cloud);
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
