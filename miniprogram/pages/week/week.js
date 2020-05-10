const { getToday } = require('../component/lib/lib');
Page({

    data: {
        week: null,
        weekDescription: '周账单',
        lostItems: [],
        lostItemsTitle: '周消费',
        incomeItems: [],
        incomeItemsTitle: '周收入',
        weekLost: 0,
        weekIncome: 0,
        totalDescription: '累计消费',
        showActionSheet: true,
        groups: [
            'choice-day',
        ],
        weekNumberOptions: [],
        onlyMe: false,
    },

    // eslint-disable-next-line no-unused-vars
    onLoad: function (options) {
        wx.showLoading({ title: '数据加载中' });
        wx.cloud.callFunction({
            name: 'lib',
            data: { date: getToday() },
        }).then(res => res.result).then(res => {
            this.setData({
                weekNumberOptions: [...Array(parseInt(res.weekNumber) + 1).keys()].reverse()
            });
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
    onOnlyMeChange: function (e) {
        this.setData({
            onlyMe: e.detail.value,
        });
    },
    loadData: function (selectedWeekNumber) {
        wx.showLoading({ title: '数据加载中' });
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'week',
                date: selectedWeekNumber,
                onlyMe: this.data.onlyMe,
            }
        }).then(res => res.result).then(res => {
            const lostItems = res.data.filter(d => d.moneyType === 'LOST').reverse();
            const incomeItems = res.data.filter(d => d.moneyType === 'INCOME').reverse();
            const weekLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            const weekIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            this.setData({
                lostItems: lostItems,
                incomeItems: incomeItems,
                weekLost: weekLost,
                week: selectedWeekNumber,
                weekIncome: weekIncome,
            });
        }).then(() => {
            wx.hideLoading();
        });
    }

});
