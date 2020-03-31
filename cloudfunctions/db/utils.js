const cloud = require('wx-server-sdk');
cloud.init();

async function getWeekNumber(date) {
    return (await cloud.callFunction({
        name: "lib",
        data: { date }
    })).result.weekNumber;
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getMonth(date) {
    return parseInt(date.split('-')[1]);
}

function getYear(date) {
    return parseInt(date.split('-')[0])
}

module.exports = {
    getWeekNumber,
    getToday,
    getMonth,
    getYear,
};
