import { getFromCache, weekNumberCacheKey } from './cacheUtils';

export const getToday = function () {
    return new Date(Date.now()).toISOString().split('T')[0];
};

export const getDay = function (date) {
    return date.split('-')[2];
};

export const getCurrentWeek = function () {
    return getFromCache(weekNumberCacheKey);
};

export const getCurrentMonth = function () {
    return getMonth(getToday());
};

export const getMonth = function (date) {
    return date.split('-')[1];
};

export const getCurrentYear = function () {
    return getYear(getToday());
};

export const getYear = function (date) {
    return date.split('-')[0];
};

export const getWeekNumberOptions = function (weekNumber) {
    const weekNumberOptions =
        [...Array(parseInt(weekNumber) + 1).keys()].sort((a, b) => b - a);
    weekNumberOptions.pop();
    return weekNumberOptions;
};

export const getTotalCount = function (items) {
    return parseToFloat(items.reduce((acc, item) => {
        if (item.moneyType === 'INCOME'){
            return acc - parseFloat(item.count);
        }
        return acc + parseFloat(item.count);
    }, 0));
};

export const parseToFloat = function (string) {
    return parseFloat(string).toFixed(2);
};

export const getTotal = function (allItems) {
    const lostItems = allItems.filter(d => d.moneyType === 'LOST');
    const incomeItems = allItems.filter(d => d.moneyType === 'INCOME');
    const totalLost = parseToFloat(lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0));
    const totalIncome = parseToFloat(incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0));
    return { totalIncome, totalLost };
};

export const isEmpty = function (data) {
    return data == null || data.length === 0;
};

export const getWx = function () {
    return wx;
};

export const groupingTypeMap = {
    '类别': 'type',
    '日期': 'date',
};

export const groupingData = (data, groupingBy) => {
    return data.reduce((acc, item) => {
        acc[item[groupingBy]] = acc[item[groupingBy]] || [];
        acc[item[groupingBy]].push(item);
        return acc;
    }, {});
};

export function showSuccess(successCallback = () => getWx().navigateBack({ delta: -1, })) {
    getWx().showToast({
        title: '添加成功',
        success: () => {
            setTimeout(function () {
                successCallback();
            }, 1000);
        }
    });
}


export function redirectToDayPage(date) {
    wx.redirectTo({
        url: `/pages/day/day?date=${ date }`
    });
}

export function navigateToDayPage(date) {
    wx.navigateTo({
        url: `/pages/day/day?date=${ date }`
    });
}
