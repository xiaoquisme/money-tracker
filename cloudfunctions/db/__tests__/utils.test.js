const utils = require('../src/utils');

describe("utils", () => {
    describe("getWeekNumber", () => {
        it('should get WeekNumber correctly', async function () {
            const cloudFunction = jest.fn().mockResolvedValue({ result: { weekNumber: 1 } });
            const cloud = {
                callFunction: cloudFunction,
            };
            const result = await utils.getWeekNumber(cloud, "2020-01-01");
            expect(result).toBe(1);
        });
    });

    describe('getToday', () => {
        it('should return yyyy-MM-dd format date', () => {
            const timeStamp = new Date("2011-01-01").getTime();
            jest.spyOn(Date, 'now').mockImplementation(() => timeStamp);
            const today = utils.getToday();
            expect(today).toBe("2011-01-01");
        });
    });

    describe("getMonth", () => {
        it('should get 1 with date: 2020-01-01', function () {
            expect(utils.getMonth("2020-01-01")).toBe(1);
        });
    });

    describe("getYear", () => {
        it('should get 2020 with date: 2020-01-01', function () {
            expect(utils.getYear("2020-01-01")).toBe(2020);
        });
    });

    describe("getDatabase", () => {
        it('should getDatabase', function () {
            const mockFunc = jest.fn().mockReturnValue(1);
            const cloud = {
                database: mockFunc,
            };
            expect(utils.getDatabase(cloud)).toBe(1);
            expect(mockFunc).toHaveBeenCalled();
        });
    });

    describe("getUserId", () => {
        it('should getUserId', function () {
            const mockFunc = jest.fn().mockReturnValue({ OPENID: 1 });
            const cloud = {
                getWXContext: mockFunc,
            };
            expect(utils.getUserId(cloud)).toBe(1);
            expect(mockFunc).toHaveBeenCalled();
        });
    });
});
