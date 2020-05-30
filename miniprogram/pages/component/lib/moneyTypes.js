import { getData, incomeTypesCacheKey, lostTypesCacheKey } from './cacheUtils';

async function getIncomeTypes() {
    return getData(incomeTypesCacheKey, getIncomeTypesFromDB);
}

async function getIncomeTypesFromDB() {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'money-types-income'
        }
    }).then(res => res.result.data);
}


async function getLostItems() {
    return getData(lostTypesCacheKey, getLostItemsFromDB);
}

async function getLostItemsFromDB() {
    return wx.cloud.callFunction({
        name: 'db',
        data: {
            type: 'money-types-lost'
        }
    }).then(res => res.result.data);
}

export {
    getIncomeTypes,
    getLostItems
};
