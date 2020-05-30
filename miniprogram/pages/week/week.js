import { getData, weekNumberOptionsCacheKey } from '../component/lib/cacheUtils';
import { getWeekNumberOptions } from '../component/lib/lib';
import { getWeekDataFromDB, getWeekNumberOptionsFromDB } from '../component/lib/moneyTracker';

Page({

    data: {
        week: null,
        weekDescription: '周账单',
        showActionSheet: true,
        groups: [
            'choice-day',
        ],
        weekNumberOptions: [],
        allItems: []
    },
    onPullDownRefresh: function () {
        this.loadData(this.data.week);
    },
    onLoad: function () {
        wx.showLoading({ title: '数据加载中' });
        getData(weekNumberOptionsCacheKey, getWeekNumberOptionsFromDB)
            .then(weekNumber => {
                this.setData({
                    weekNumberOptions: getWeekNumberOptions(weekNumber)
                });
            }).then(() => wx.hideLoading());
    },
    onWeekSelect: function (e) {
        const selectedWeekNumber = this.data.weekNumberOptions[e.detail.value];
        this.setData({
            week: selectedWeekNumber,
            showActionSheet: false,
        });
        this.loadData(selectedWeekNumber);
    },
    closeActionSheet: function () {
        this.setData({
            showActionSheet: false,
        });
        wx.navigateBack({
            delta: -1
        });
    },
    loadData: function (selectedWeekNumber) {
        wx.showLoading({ title: '数据加载中' });
        getWeekDataFromDB(selectedWeekNumber)
            .then(res => {
                this.setData({
                    week: selectedWeekNumber,
                    allItems: res.data
                });
            }).then(() => {
            wx.hideLoading();
            wx.stopPullDownRefresh();
        });
    }
});
