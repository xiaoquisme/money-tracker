// 云函数入口文件
const cloud = require('wx-server-sdk');
const _ = require('lodash');

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
    if (type === "money-types-income") {
        return await findAllMoneyIncomeTypes();
    }
    if (type === "money-types-add") {
        return await addMoneyType(data);
    }
    if (type === "delete-money-tracker") {
        return await deleteMoneyTracker(data);
    }
    if (type === "add-money-tracer") {
        return await addMoneyTracker(data);
    }
    if(type === 'refreshDataWithMonthAndYear'){
        return await refreshDataWithMonthAndYear(data);
    }
    return [];
};

async function addMoneyTracker(data) {
    const { date } = data;
    const weekNumber = await getWeekNumber(date);
    return db.collection("money-tracker")
        .add({
            data: {
                ...data,
                isDelete: false,
                weekNumber,
                month: getMonth(date),
                year: getYear(date)
            }
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

async function getAllData() {
    const totalCount = await db.collection("money-tracker").count();
    const batchTimes = Math.ceil(totalCount / 100);
    const tasks = [];
    for (let page in batchTimes) {
        const promise = db.collection("money-tracker").skip(page * 100).limit(100).get();
        tasks.push(promise);
    }
    return (await Promise.all(tasks)).reduce((acc, currentValue) => {
        return {
            data: acc.data.concat(currentValue.data),
            errorMessage: acc.errorMessage,
        }
    }, { data: null, errorMessage: null })
}

async function refreshDataWithMonthAndYear(weekNumber) {
    const response = await db.collection("money-tracker").get();
    return (await Promise.all(response.data.map(d => {
        return {
            ...d,
            month: getMonth(d.date),
            year: getYear(d.date)
        }
    }).map(item => {
        return db.collection("money-tracker")
            .where({
                _id: item._id
            })
            .update({
                data: _.omit(item, '_id'),
            });
    })));

}

function getMonth(date) {
    return parseInt(date.split('-')[1]);
}

function getYear(date) {
    return parseInt(date.split('-')[0])
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

async function deleteTodayTestData() {
    const today = getToday();
    return db.collection("money-tracker")
        .where({
            date: today,
            comment: '111'
        }).remove();

}
