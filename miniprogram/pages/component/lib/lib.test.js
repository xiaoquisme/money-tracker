import * as cacheUtils from './cacheUtils';

jest.mock('./cacheUtils');

import * as lib from './lib';


describe('lib', () => {
    describe('getToday', () => {
        it('should get data with format yyyy-MM-dd', function () {
            jest.spyOn(Date, 'now').mockReturnValue(1591651555733);
            const today = lib.getToday();
            expect(today).toBe('2020-06-08');
        });
    });
    describe('getCurrentWeek', () => {
        it('should get current Week', function () {
            cacheUtils.getFromCache.mockReturnValue([1, 2, 3]);
            const result = lib.getCurrentWeek();
            expect(result).toStrictEqual([1, 2, 3]);
        });
    });

    describe('getCurrentMonth', () => {
        it('should getCurrentMonth', function () {
            jest.spyOn(Date, 'now').mockReturnValue(1591651555733);
            expect(lib.getCurrentMonth()).toBe('06');
        });
    });
    describe('getCurrentYear', () => {
        it('should getCurrentYear', function () {
            jest.spyOn(Date, 'now').mockReturnValue(1591651555733);
            expect(lib.getCurrentYear()).toBe('2020');
        });
    });
    describe('getWeekNumberOptions', () => {
        it('should getWeekNumberOptions', function () {
            expect(lib.getWeekNumberOptions(3)).toStrictEqual([3, 2, 1]);
        });
    });
    describe('getTotalCount', () => {
        it('should getTotalCount', function () {
            expect(lib.getTotalCount([{ count: 1.001 }, { count: 2.222, }])).toBe('3.22');
        });

        it('should get 2.00 when income 6  lost 8', function () {
            expect(lib.getTotalCount([{ count: 8, moneyType: 'LOST' }, {
                count: 6,
                moneyType: 'INCOME'
            }])).toBe('2.00');
        });

        it('should get -2.00 when income 8  lost 6', function () {
            expect(lib.getTotalCount([{ count: 6, moneyType: 'LOST' }, {
                count: 8,
                moneyType: 'INCOME'
            }])).toBe('-2.00');
        });
        it('should get 0.00 when income 8  lost 8', function () {
            expect(lib.getTotalCount([{ count: 8, moneyType: 'LOST' }, {
                count: 8,
                moneyType: 'INCOME'
            }])).toBe('0.00');
        });

    });
    describe('parseToFloat', () => {
        it('should parseToFloat', function () {
            expect(lib.parseToFloat('2020.2020')).toBe('2020.20');
        });
    });
    describe('getTotal', () => {
        it('should getTotal', function () {
            const { totalIncome, totalLost } = lib.getTotal([
                {
                    moneyType: 'LOST',
                    count: '1.1'
                }, {
                    moneyType: 'LOST',
                    count: '1.1'
                }, {
                    moneyType: 'INCOME',
                    count: '1.1'
                }, {
                    moneyType: 'INCOME',
                    count: '1.1'
                },
            ]);
            expect(totalLost).toBe('2.20');
            expect(totalIncome).toBe('2.20');
        });
    });
    describe('isEmpty', () => {
        it.each`
        source          | expected
        ${ null }       | ${ true }
        ${ [] }         | ${ true }
        ${ {} }         | ${ false }
        ${ undefined }  | ${ true }
        ${ 0 }          | ${ false }
        ${ false }      | ${ false }
        ${ true }       | ${ false }
        ${ '' }         | ${ true }        
        `('given $source should return $expected', function ({ source, expected }) {
            expect(lib.isEmpty(source)).toBe(expected);
        });

    });
});
