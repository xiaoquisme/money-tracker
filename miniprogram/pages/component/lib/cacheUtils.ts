import {isEmpty, getWx} from './lib';

export const incomeTypesCacheKey = 'incomeTypesCacheKey';
export const lostTypesCacheKey = 'lostTypesCacheKey';

export const weekNumberCacheKey = 'weekNumberCacheKey';

export const allItemsCacheKey = 'all-items-cache-key';

export const cache = function (key: string, data: any): void {
    getWx().setStorageSync(key, data);
};

export const getFromCache = function (key: string): void {
    return getWx().getStorageSync(key);
};

export const removeFromCache = function (key: string): void {
    getWx().removeStorageSync(key);
};
export const clearCache = function (): void {
    getWx().clearStorageSync();
};


async function getData(cacheKey: string, dataSource: () => Promise<any>):Promise<any> {
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
