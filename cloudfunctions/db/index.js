// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type, date } = event;
    if (type === "today") {
        return await getTodayData(date);
    }
    if (type === "week") {
        return await getWeekData(date);
    }
    return [];
};

async function getTodayData(today) {
    return db.collection("money-tracker")
        .where({
            date: today
        })
        .get();
}

async function getWeekData(date) {
    const { weekNumber } = (await cloud.callFunction({
        name: "lib",
        data: { date }
    })).result;

    return db.collection("money-tracker")
        .where({
            weekNumber: weekNumber,
        }).get();
}
