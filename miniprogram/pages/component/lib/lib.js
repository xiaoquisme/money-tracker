export const getToday = function () {
    return new Date().toISOString().split('T')[0];
};

export const getWeekNumberOptions = function (weekNumber) {
    const weekNumberOptions = [...Array(parseInt(weekNumber) + 1).keys()].sort((a, b) => b - a);
    weekNumberOptions.pop();
    return weekNumberOptions;
};

export const getTotalCount = function (items) {
    return parseToFloat(items.reduce((acc, item) => acc + parseFloat(item.count), 0));
};

export const parseToFloat = function (string) {
    return parseFloat(string).toFixed(2);
};

export const getTotal = function (allItems) {
    const lostItems = allItems.filter(d => d.moneyType === 'LOST').reverse();
    const incomeItems = allItems.filter(d => d.moneyType === 'INCOME').reverse();
    const totalLost = parseToFloat(lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0));
    const totalIncome = parseToFloat(incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0));
    return { totalIncome, totalLost };
};

export const cache = function (key, data) {
    wx.setStorageSync(key, data);
};

export const getFromCache = function (key) {
    return wx.getStorageSync(key);
};

export const removeFromCache = function (key) {
    wx.removeStorageSync(key);
};
export const clearCache = function () {
    wx.clearStorageSync();
};

export function showSuccess() {
    wx.showToast({
        title: '添加成功',
        success: () => {
            setTimeout(function () {
                wx.navigateBack({
                    delta: -1,
                });
            }, 1000);
        }
    });
}
