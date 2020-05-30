import { getDayDataFromDB } from '../component/lib/moneyTracker';
import { allItemsCacheKey, removeFromCache } from '../component/lib/cacheUtils';

Page({
    data: {
        day: null,
        todayDescription: '日账单',
        showActionSheet: true,
        groups: [
            'choice-day',
        ],
        allItems: []
    },
    onPullDownRefresh: function () {
        removeFromCache(allItemsCacheKey);
        this.loadData(this.data.day);
    },
    onDateChange: function (event) {
        const selectedDate = event.detail.value;
        this.setData({
            day: selectedDate,
            showActionSheet: false,
        });
        this.loadData(selectedDate);
    },
    closeActionSheet: function () {
        this.setData({
            showActionSheet: false,
        });
        wx.navigateBack({
            delta: -1
        });
    },
    loadData: function (selectedDate) {
        wx.showLoading({ title: '数据加载中' });
        getDayDataFromDB(this.data.day)
            .then(res => {
                this.setData({
                    day: selectedDate,
                    allItems: res.data,
                });
            }).then(() => {
            wx.hideLoading();
            wx.stopPullDownRefresh();
        });
    }
});
