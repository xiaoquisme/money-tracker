import { getToday } from './lib';

async function deleteItem(data) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'delete-money-tracker',
            data: {
                id: data._id
            }
        }
    });
}

async function addItem(data) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'add-money-tracer',
            data: data,
        }
    });
}

async function updateItem(data) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'update-money-tracer',
            data: data,
        }
    });
}


async function findById(id) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'findById',
            data: {
                id: id,
            }
        }
    }).then(res => res.result.data[0]);
}

async function getWeekNumberOptionsFromDB() {
    return wx.cloud.callFunction({
        name: 'lib',
        data: { date: getToday() },
    }).then(res => res.result.weekNumber);
}

/*
@param day
    format: yyyy-MM-dd
 */
async function getDayDataFromDB(day) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'day',
            date: day,
        }
    }).then(res => res.result);
}

async function getWeekDataFromDB(weekNumber) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'week',
            date: weekNumber,
        }
    }).then(res => res.result);
}

async function getMonthDataFromDB(selectedDate) {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'month',
            date: {
                year: selectedDate.split('-')[0],
                month: selectedDate.split('-')[1],
            },
        }
    }).then(res => res.result);
}

export {
    findById,
    deleteItem,
    addItem,
    updateItem,
    getWeekNumberOptionsFromDB,
    getDayDataFromDB,
    getWeekDataFromDB,
    getMonthDataFromDB,
};
