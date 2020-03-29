// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type, date, data } = event;
    if (type === "day") {
        return await getDayData(date);
    }
    if (type === "week") {
        return await getWeekData(date);
    }
    if (type === "remove-today-test") {
        return await deleteTodayTestData();
    }
    if (type === "money-types-lost") {
        return await findAllMoneyLostTypes();
    }
    if(type === "money-types-income") {
        return await findAllMoneyIncomeTypes();
    }
    if (type === "money-types-add") {
        return await addMoneyType(data);
    }
    if(type === "delete-money-tracker"){
        return await deleteMoneyTracker(data);
    }
    if(type === "add-money-tracer"){
        return await addMoneyTracker(data);
    }
    return [];
};

async function addMoneyTracker(data) {
    const {date} = data;
    const weekNumber = await getWeekNumber(date);
    return db.collection("money-tracker")
        .add({
            data: {...data, isDelete: false, weekNumber}
        })
}


async function deleteMoneyTracker(data) {
    return db.collection("money-tracker")
        .where({
            _id: data.id,
        }).update({
            data: {
                isDelete: true
            }
        });
}

async function findAllMoneyIncomeTypes() {
    return db.collection("money-types")
        .where({
            value: "INCOME",
            isActive: true,
        }).get();
}

async function addMoneyType(data) {
    return db.collection("money-types")
        .add({
            data: { ...data }
        });
}

async function findAllMoneyLostTypes() {
    return db.collection("money-types")
        .where({
            value: "LOST",
            isActive: true,
        }).get();
}

async function getDayData(day) {
    return db.collection("money-tracker")
        .where({
            date: day,
            isDelete: false,
        })
        .get();
}

async function getWeekNumber(date) {
    return (await cloud.callFunction({
        name: "lib",
        data: { date }
    })).result.weekNumber;
}

async function getWeekData(weekNumber) {
    return db.collection("money-tracker")
        .where({
            weekNumber: parseInt(weekNumber),
            isDelete: false,
        }).get();
}

async function deleteTodayTestData() {
    const today = new Date().toISOString().split('T')[ 0 ];
    return db.collection("money-tracker")
        .where({
            date: today,
            comment: '111'
        }).remove();

}
