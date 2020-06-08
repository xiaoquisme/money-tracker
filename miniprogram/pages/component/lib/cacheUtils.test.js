import * as lib from './lib';

jest.mock('./lib');

import * as cacheUtils from './cacheUtils';

describe('cacheUtils test', () => {
    describe('cache', () => {
        it('should cache success with given key and data', function () {
            const mockWx = {
                setStorageSync: jest.fn()
            };
            lib.getWx.mockReturnValue(mockWx);
            const cacheKey = 'asd';
            const data = { 'name': 'asdf' };
            cacheUtils.cache(cacheKey, data);
            expect(mockWx.setStorageSync).toHaveBeenCalled();
            expect(mockWx.setStorageSync.mock.calls[0][0]).toBe(cacheKey);
            expect(mockWx.setStorageSync.mock.calls[0][1]).toBe(data);
        });
    });

    describe('getFromCache', () => {

        it('should get data from cache success', function () {
            const key = 'key';
            const mockWx = {
                getStorageSync: jest.fn().mockImplementation((cachedKey) => {
                    if (cachedKey === key) {
                        return {
                            name: 'name'
                        };
                    }
                    return {
                        name: 'lisi'
                    };
                })
            };
            lib.getWx.mockReturnValue(mockWx);
            const result = cacheUtils.getFromCache(key);
            expect(result).toStrictEqual({ name: 'name' });
        });
    });
    describe('removeFromCache', () => {

        it('should remove data from cache', function () {
            const mockWx = {
                removeStorageSync: jest.fn()
            };
            lib.getWx.mockReturnValue(mockWx);
            cacheUtils.removeFromCache('key');
            expect(mockWx.removeStorageSync).toBeCalledWith('key');
        });
    });

    describe('clearCache', () => {
        it('should clear cache ', function () {
            const mockWx = {
                clearStorageSync: jest.fn()
            };
            lib.getWx.mockReturnValue(mockWx);
            cacheUtils.clearCache();
            expect(mockWx.clearStorageSync).toHaveBeenCalled();
        });
    });
    describe('getData', () => {
        const key = '123';
        let mockWx;
        const isEmpty = function (data) {
            return data == null || data.length === 0;
        };
        beforeEach(() => {
            mockWx = {
                getStorageSync: jest.fn().mockImplementation(cachedKey => {
                    if (cachedKey === key) {
                        return {
                            name: 'from cache'
                        };
                    }
                    return null;
                }),
                setStorageSync: jest.fn()
            };
            lib.getWx.mockReturnValue(mockWx);
            lib.isEmpty.mockImplementation((data) => isEmpty(data));
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should getData from cache when the data already cached', async function () {
            const result = await cacheUtils.getData(key, null);
            expect(result).toStrictEqual({ name: 'from cache' });
        });

        it('should get data from getDataMethod when data is not cached ', async function () {
            const result = await cacheUtils.getData('111', () => Promise.resolve({ name: 'from data' }));
            expect(result).toStrictEqual({ name: 'from data' });
        });
        it('should cache data when data from source', async function () {
            const result = await cacheUtils.getData('111', () => Promise.resolve({ name: 'from data' }));
            expect(result).toStrictEqual({ name: 'from data' });
            expect(mockWx.setStorageSync.mock.calls[0][0]).toBe('111');
            expect(mockWx.setStorageSync.mock.calls[0][1]).toStrictEqual({ name: 'from data' });
        });
    });
});
