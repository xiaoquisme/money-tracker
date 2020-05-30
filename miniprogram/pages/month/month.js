// miniprogram/pages/month/month.js
import { getCurrentMonth, getCurrentYear } from '../component/lib/lib';
import { getMonthDataFromDB } from '../component/lib/moneyTracker';
import { allItemsCacheKey, removeFromCache } from '../component/lib/cacheUtils';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        month: null,
        monthDescription: '月账单',
        groups: [
            'choice-month',
        ],
        allItems: []
    },
    onPullDownRefresh: function () {
        removeFromCache(allItemsCacheKey);
        this.loadData(this.data.month);
    },
    onLoad: function () {
        const currentMonth = getCurrentMonth();
        const currentYear = getCurrentYear();
        this.setData({ month: `${currentYear}-${currentMonth}`});
        this.loadData(this.data.month);
    },
    loadData: function (selectedDate) {
        wx.showLoading({ title: '数据加载中' });
        removeFromCache(allItemsCacheKey);
        getMonthDataFromDB(selectedDate)
            .then(res => {
                this.setData({
                    allItems: res.data
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
            month: selectedDate,
        });
        this.loadData(selectedDate);
    },
});
