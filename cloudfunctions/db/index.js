// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const { type, date, data } = event;
    if (type === "today") {
        return await getTodayData(date);
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
    return [];
};


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

async function getTodayData(today) {
    return db.collection("money-tracker")
        .where({
            date: today,
            isDelete: false,
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
