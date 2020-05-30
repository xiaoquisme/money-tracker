import { cache, getData, weekNumberOptionsCacheKey } from '../component/lib/cacheUtils';
import { getWeekNumberOptions } from '../component/lib/lib';
import { getWeekNumberOptionsFromDB } from '../component/lib/moneyTracker';

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

    onLoad: function () {
        wx.showLoading({ title: '数据加载中' });
        getData(weekNumberOptionsCacheKey, getWeekNumberOptionsFromDB)
            .then(weekNumber => {
                this.setData({
                    weekNumberOptions: getWeekNumberOptions(weekNumber)
                });
                cache(weekNumberOptionsCacheKey, getWeekNumberOptions(weekNumber));
            }).then(() => {
            wx.hideLoading();
        });
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
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'week',
                date: selectedWeekNumber,
            }
        }).then(res => res.result).then(res => {
            this.setData({
                week: selectedWeekNumber,
                allItems: res.data
            });
        }).then(() => {
            wx.hideLoading();
        });
    }

});
