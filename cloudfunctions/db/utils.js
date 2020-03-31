async function getWeekNumber(cloud, date) {
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

function getDatabase(cloud) {
    return cloud.database();
}

module.exports = {
    getWeekNumber,
    getToday,
    getMonth,
    getYear,
    getDatabase,
};
