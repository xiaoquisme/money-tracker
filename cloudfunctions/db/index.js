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
        return await getDayData(date, db);
    }
    if (type === "week") {
        return await getWeekData(date, db);
    }
    if (type === "remove-today-test") {
        return await deleteTodayTestData(db);
    }
    if (type === "money-types-lost") {
        return await findAllMoneyLostTypes(db);
    }
    if (type === "money-types-income") {
        return await findAllMoneyIncomeTypes(db);
    }
    if (type === "money-types-add") {
        return await addMoneyType(data, db);
    }
    if (type === "delete-money-tracker") {
        return await deleteMoneyTracker(data, db);
    }
    if (type === "add-money-tracer") {
        return await addMoneyTracker(data, db);
    }
    if (type === 'refreshDataWithMonthAndYear') {
        return await refreshDataWithMonthAndYear(data, db);
    }
    return [];
};
