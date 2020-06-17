import { allItemsCacheKey, getData, removeFromCache, weekNumberCacheKey } from '../component/lib/cacheUtils';
import { getCurrentWeek, getWeekNumberOptions } from '../component/lib/lib';
import { getWeekDataFromDB, getWeekNumberOptionsFromDB } from '../component/lib/moneyTracker';

Page({

    data: {
        week: null,
        weekDescription: '周账单',
        weekNumberOptions: [],
        allItems: []
    },
    onPullDownRefresh: function () {
        removeFromCache(allItemsCacheKey);
        this.loadData(this.data.week);
    },
    onLoad: function () {
        wx.showLoading({ title: '数据加载中' });
        removeFromCache(allItemsCacheKey);
        removeFromCache(weekNumberCacheKey);
        getData(weekNumberCacheKey, getWeekNumberOptionsFromDB)
            .then(weekNumber => {
                this.setData({
                    weekNumberOptions: getWeekNumberOptions(weekNumber)
                });
            }).then(() => wx.hideLoading())
            .then(() => {
                const currentWeek = getCurrentWeek();
                this.setData({ week: currentWeek });
                this.loadData(currentWeek);
            });
    },
    onWeekSelect: function (e) {
        removeFromCache(allItemsCacheKey);
        const selectedWeekNumber = this.data.weekNumberOptions[e.detail.value];
        this.setData({
            week: selectedWeekNumber,
        });
        this.loadData(selectedWeekNumber);
    },
    loadData: function (selectedWeekNumber: string) {
        wx.showLoading({ title: '数据加载中' });
        getWeekDataFromDB(selectedWeekNumber)
            .then(res => {
                this.setData({
                    allItems: res.data
                });
            }).then(() => {
            wx.hideLoading();
            wx.stopPullDownRefresh();
        });
    }
});
