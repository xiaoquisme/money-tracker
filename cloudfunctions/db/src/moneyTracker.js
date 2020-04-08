const { getWeekNumber, getYear, getMonth, getToday, getDatabase, getUserId } = require('./utils');
const _ = require('lodash');

async function addMoneyTracker(data, cloud) {
    const { date } = data;
    const weekNumber = await getWeekNumber(cloud, date);
    const db = getDatabase(cloud);
    return db.collection('money-tracker')
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
    return db.collection('money-tracker')
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
    return db.collection('money-tracker')
        .where({
            date: day,
            _openid: getUserId(cloud),
            isDelete: false,
        })
        .get();
}

async function getDayWithAll(day, cloud) {
    const db = getDatabase(cloud);
    return db.collection('money-tracker')
        .where({
            date: day,
            isDelete: false,
        })
        .get();
}

function getWeekDataWithOnlyMe(weekNumber, cloud) {
    const userId = getUserId(cloud);
    const db = getDatabase(cloud);
    return db.collection('money-tracker')
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
    return db.collection('money-tracker')
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
    return db.collection('money-tracker')
        .where({
            year: parseInt(year),
            month: parseInt(month),
            isDelete: false,
        }).get();
}

async function getMonthDataWithOnlyMe(year, month, cloud) {
    const db = getDatabase(cloud);
    return db.collection('money-tracker')
        .where({
            year: parseInt(year),
            month: parseInt(month),
            _openid: getUserId(cloud),
            isDelete: false,
        }).get();
}

// eslint-disable-next-line no-unused-vars
async function getAllData(db) {
    const totalCount = await db.collection('money-tracker').count();
    const batchTimes = Math.ceil(totalCount / 100);
    const tasks = [];

    for (let page in batchTimes) {
        const promise = db.collection('money-tracker').skip(page * 100).limit(100).get();
        tasks.push(promise);
    }
    return (await Promise.all(tasks)).reduce((acc, currentValue) => {
        return {
            data: acc.data.concat(currentValue.data),
            errorMessage: acc.errorMessage,
        };
    }, { data: null, errorMessage: null });
}

async function refreshDataWithMonthAndYear(weekNumber, cloud) {
    const db = getDatabase(cloud);
    const response = await db.collection('money-tracker').get();
    return (await Promise.all(response.data.map(d => {
        return {
            ...d,
            month: getMonth(d.date),
            year: getYear(d.date)
        };
    }).map(item => {
        return db.collection('money-tracker')
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
    return db.collection('money-tracker')
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
