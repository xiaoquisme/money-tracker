import { isEmpty, getWx } from './lib';

export const incomeTypesCacheKey = 'incomeTypesCacheKey';
export const lostTypesCacheKey = 'lostTypesCacheKey';

export const weekNumberCacheKey = 'weekNumberCacheKey';

export const allItemsCacheKey = 'all-items-cache-key';

export const cache = function (key, data) {
    getWx().setStorageSync(key, data);
};

export const getFromCache = function (key) {
    return getWx().getStorageSync(key);
};

export const removeFromCache = function (key) {
    getWx().removeStorageSync(key);
};
export const clearCache = function () {
    getWx().clearStorageSync();
};


async function getData(cacheKey, dataSource) {
    const cachedResult = getFromCache(cacheKey);
    if (!isEmpty(cachedResult)) {
        return Promise.resolve(cachedResult);
    }
    return dataSource()
        .then((data) => {
            cache(cacheKey, data);
            return data;
        });
}

export {
    getData,
};
