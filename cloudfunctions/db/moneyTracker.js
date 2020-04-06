const { getWeekNumber, getYear, getMonth, getToday, getDatabase } = require("./utils");
const _ = require('lodash');

async function addMoneyTracker(data, cloud) {
    const { date } = data;
    const weekNumber = await getWeekNumber(cloud, date);
    const db = getDatabase(cloud);
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

async function deleteMoneyTracker(data, cloud) {
    const db = getDatabase(cloud);
    return db.collection("money-tracker")
        .where({
            _id: data.id,
        }).update({
            data: {
                isDelete: true
            }
        });
}

async function getDayData(day, cloud) {
    const db = getDatabase(cloud);
    return db.collection("money-tracker")
        .where({
            date: day,
            isDelete: false,
        })
        .get();
}

async function getWeekData(weekNumber, cloud) {
    const db = getDatabase(cloud);
    return db.collection("money-tracker")
        .where({
            weekNumber: parseInt(weekNumber),
            isDelete: false,
        }).get();
}

async function getMonthData(year, month, cloud) {
    const db = getDatabase(cloud);
    return db.collection("money-tracker")
        .where({
            year: parseInt(year),
            month: parseInt(month),
            isDelete: false,
        }).get();
}

async function getAllData(db) {
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

async function refreshDataWithMonthAndYear(weekNumber, cloud) {
    const db = getDatabase(cloud);
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

async function deleteTodayTestData(cloud) {
    const db = getDatabase(cloud);
    const today = getToday();
    return db.collection("money-tracker")
        .where({
            date: today,
            comment: '111'
        }).remove();

}

module.exports = {
    addMoneyTracker,
    deleteMoneyTracker,
    getDayData,
    getWeekData,
    getMonthData,
    refreshDataWithMonthAndYear,
    deleteTodayTestData,
};
