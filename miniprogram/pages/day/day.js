import { getDayDataFromDB } from '../component/lib/moneyTracker';
import { allItemsCacheKey, removeFromCache } from '../component/lib/cacheUtils';
import { getToday } from '../component/lib/lib';

Page({
    data: {
        day: null,
        todayDescription: '日账单',
        groups: [
            'choice-day',
        ],
        allItems: []
    },
    onPullDownRefresh: function () {
        removeFromCache(allItemsCacheKey);
        this.loadData(this.data.day);
    },
    onLoad: function () {
        const today = getToday();
        this.setData({ day: today });
        this.loadData(today);
    },
    loadData: function (day) {
        wx.showLoading({ title: '数据加载中' });
        removeFromCache(allItemsCacheKey);
        getDayDataFromDB(day)
            .then(res => {
                this.setData({
                    allItems: res.data,
                });
            }).then(() => {
            wx.hideLoading();
            wx.stopPullDownRefresh();
        });
    },
    onDateChange: function (event) {
        removeFromCache(allItemsCacheKey);
        const selectedDate = event.detail.value;
        this.setData({
            day: selectedDate,
        });
        this.loadData(selectedDate);
    }
});
