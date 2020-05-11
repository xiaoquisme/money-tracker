// miniprogram/pages/month/month.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        month: null,
        monthDescription: '月账单',
        monthLost: 0,
        monthIncome: 0,
        totalDescription: '累计消费',
        showActionSheet: true,
        groups: [
            'choice-month',
        ],
        onlyMe: false,
        allItems:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    // eslint-disable-next-line no-unused-vars
    onLoad: function (options) {

    },

    onDateChange: function (event) {
        const selectedDate = event.detail.value;
        this.setData({
            month: selectedDate,
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
    onOnlyMeChange: function (e) {
        this.setData({
            onlyMe: e.detail.value,
        });
    },
    onPullDownRefresh: function () {

    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    },
    loadData: function (selectedDate) {
        wx.showLoading({ title: '数据加载中' });
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'month',
                date: {
                    year: selectedDate.split('-')[0],
                    month: selectedDate.split('-')[1],
                },
                onlyMe: this.data.onlyMe,
            }
        }).then(res => res.result).then(res => {
            const lostItems = res.data.filter(d => d.moneyType === 'LOST').reverse();
            const incomeItems = res.data.filter(d => d.moneyType === 'INCOME').reverse();
            const monthLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            const monthIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            this.setData({
                month: selectedDate,
                monthLost: monthLost,
                monthIncome: monthIncome,
                allItems:res.data
            });
        }).then(() => {
            wx.hideLoading();
        });
    }
});
