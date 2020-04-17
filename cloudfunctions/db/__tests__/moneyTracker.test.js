const utils = require('../src/utils');
jest.mock('../src/utils');
const moneyTracker = require('../src/moneyTracker');
const { mockCloudDB } = require('../cloudDBTestUtils');

describe('moneyTrackerTest', () => {
    describe('addMoneyTracker', () => {
        it('should return correct data', async function () {
            utils.getWeekNumber.mockResolvedValue(1);
            utils.getMonth.mockReturnValue(1);
            utils.getYear.mockReturnValue(2020);
            utils.getUserId.mockReturnValue('userId');
            const mockDB = mockCloudDB('success');
            utils.getDatabase.mockReturnValue(mockDB());
            const cloud = jest.fn().mockReturnValue(null);
            const data = {
                date: '2020-01-01',
            };
            const response = await moneyTracker.addMoneyTracker(data, cloud);
            expect(response).toBe('success');
            expect(mockDB().collection).toBeCalledWith('money-tracker');
            expect(mockDB().collection().add).toBeCalledWith({
                data: {
                    _openid: 'userId',
                    date: '2020-01-01',
                    isDelete: false,
                    month: 1,
                    weekNumber: 1,
                    year: 2020
                }
            });
        });
    });

    describe('deleteMoneyTracker', () => {
        it('should delete MoneyTrackerData', async function () {
            const mockDB = mockCloudDB('success');
            utils.getDatabase.mockReturnValue(mockDB());
            const data = {
                id: 1
            };
            const response = await moneyTracker.deleteMoneyTracker(data, null);
            expect(response).toBe('success');
            expect(mockDB().collection).toBeCalledWith('money-tracker');
            expect(mockDB().collection().where).toBeCalledWith({ _id: 1 });
            expect(mockDB().collection().where().update).toBeCalledWith({
                data: {
                    isDelete: true
                }
            });
        });
    });

    describe('getDayData', () => {

        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should get only me data when onlyMe = true', async function () {
            const mockDB = mockCloudDB('success');
            utils.getDatabase.mockReturnValue(mockDB());
            utils.getUserId.mockReturnValue('userId');
            const response = await moneyTracker.getDayData('day', 'any', true);
            expect(response).toBe('success');
            expect(mockDB().collection).toBeCalledWith('money-tracker');
            expect(mockDB().collection().where).toBeCalledWith({ date: 'day', _openid: 'userId', isDelete: false });
            expect(mockDB().collection().where().get).toHaveBeenCalled();
            expect(mockDB().collection().where().get()).toBe('success');
        });

        it('should get all data when onlyMe=false', async function () {
            const mockDB = mockCloudDB('success');
            utils.getDatabase.mockReturnValue(mockDB());
            const response = await moneyTracker.getDayData('day', 'any', false);
            expect(response).toBe('success');
            expect(mockDB).toHaveBeenCalled();
            expect(mockDB().collection).toBeCalledWith('money-tracker');
            expect(mockDB().collection().where).toBeCalledWith({ date: 'day', isDelete: false });
            expect(mockDB().collection().where().get).toHaveBeenCalled();
            expect(mockDB().collection().where().get()).toBe('success');
        });

    });

    describe('getWeekData', () => {
        it('should get only me week data when onlyMe=true', function () {
        });
    });
});
