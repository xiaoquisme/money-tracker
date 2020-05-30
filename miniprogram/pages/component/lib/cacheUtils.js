import { isEmpty } from './lib';

export const incomeTypesCacheKey = 'incomeTypesCacheKey';
export const lostTypesCacheKey = 'lostTypesCacheKey';

export const weekNumberCacheKey = 'weekNumberCacheKey';

export const allItemsCacheKey = 'all-items-cache-key';

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


async function getData(cacheKey, getData) {
    const cachedResult = getFromCache(cache);
    if (!isEmpty(cachedResult)) {
        return Promise.resolve(cachedResult);
    }
    return getData()
        .then((data) => {
            cache(cacheKey, data);
            return data;
        });
}

export {
    getData,
};
