const { getWeekNumber, getYear, getMonth, getDatabase, getUserId } = require('./utils');
const _ = require('lodash');

const dbName = 'money-tracker';

async function addMoneyTracker(data, cloud) {
    const { date } = data;
    const weekNumber = await getWeekNumber(cloud, date);
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .add({
            data: {
                ...data,
                _openid: getUserId(cloud),
                isDelete: false,
                weekNumber,
                month: getMonth(date),
                year: getYear(date)
            }
        });
}

async function deleteMoneyTracker(data, cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            _id: data.id,
        }).update({
            data: {
                isDelete: true
            }
        });
}

async function getDayData(day, cloud, onlyMe) {
    if (onlyMe) {
        return getDayWithOnlyMe(day, cloud);
    }
    return getDayWithAll(day, cloud);
}

async function getDayWithOnlyMe(day, cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            date: day,
            _openid: getUserId(cloud),
            isDelete: false,
        })
        .get();
}

async function getDayWithAll(day, cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            date: day,
            isDelete: false,
        })
        .get();
}

async function getWeekDataWithOnlyMe(weekNumber, cloud) {
    const userId = getUserId(cloud);
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            weekNumber: parseInt(weekNumber),
            isDelete: false,
            _openid: userId,
        }).get();
}

async function getWeekData(weekNumber, cloud, onlyMe) {
    if (onlyMe) {
        return getWeekDataWithOnlyMe(weekNumber, cloud);
    }
    return getWeekDataWithAll(weekNumber, cloud);

}

async function getWeekDataWithAll(weekNumber, cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            weekNumber: parseInt(weekNumber),
            isDelete: false,
        }).get();
}

async function getMonthData(year, month, cloud, onlyMe) {
    if (onlyMe) {
        return getMonthDataWithOnlyMe(year, month, cloud);
    }
    return getMonthDataWithAll(year, month, cloud);
}

async function getMonthDataWithAll(year, month, cloud) {
    const db = getDatabase(cloud);
    const monthDataDb = db.collection(dbName).where({
        year: parseInt(year),
        month: parseInt(month),
        isDelete: false,
    });

    return getAllData(monthDataDb);

}

async function getMonthDataWithOnlyMe(year, month, cloud) {
    const db = getDatabase(cloud);
    const monthOnlyMeDb = db.collection(dbName)
        .where({
            year: parseInt(year),
            month: parseInt(month),
            _openid: getUserId(cloud),
            isDelete: false,
        });
    return getAllData(monthOnlyMeDb);
}

async function getAllData(db) {
    const totalCountRes = await db.count();
    const batchTimes = Math.ceil(totalCountRes.total / 100);
    const tasks = [];

    for (let page = 0; page < batchTimes; page++) {
        const promise = db.skip(page * 100).limit(100).get();
        tasks.push(promise);
    }
    return (await Promise.all(tasks)).reduce((acc, currentValue) => {
        return {
            data: acc.data.concat(currentValue.data),
            errorMessage: acc.errorMessage,
        };
    }, { data: [], errorMessage: null });
}

async function updateMoneyTracker(data, cloud) {
    const db = getDatabase(cloud);
    return db.collection(dbName)
        .where({
            _id: data.id
        }).update({
            data: {
                ..._.omit(data, 'id')
            }
        });
}

async function findById(id, cloud) {
    const database = getDatabase(cloud);
    return database.collection(dbName)
        .where({
            _id: id
        }).get();
}

module.exports = {
    addMoneyTracker,
    deleteMoneyTracker,
    getDayData,
    getWeekData,
    getMonthData,
    findById,
    updateMoneyTracker,
    dbName
};
