Page({

    data: {
        day: null,
        todayDescription: "日账单",
        lostItems: [],
        lostItemsTitle: "日消费",
        incomeItems: [],
        incomeItemsTitle: "日收入",
        todayLost: 0,
        todayIncome: 0,
        totalDescription: "累计消费",
        showActionSheet: true,
        groups: [
            "choice-day",
        ]
    },

    onLoad: function (options) {
    },

    onDateChange: function (event) {
        wx.showLoading({ title: '数据加载中' });
        const selectedDate = event.detail.value;
        this.setData({
            day: selectedDate,
            showActionSheet: false,
        });
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'day',
                date: selectedDate,
            }
        }).then(res => res.result).then(res => {
            const lostItems = res.data.filter(d => d.moneyType == "LOST").reverse();
            const incomeItems = res.data.filter(d => d.moneyType == "INCOME").reverse();
            const todayLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            const todayIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            this.setData({
                lostItems: lostItems,
                incomeItems: incomeItems,
                day: selectedDate,
                todayLost: todayLost,
                todayIncome: todayIncome,
            });
        }).then(any => {
            wx.hideLoading();
        });
    },
    closeActionSheet: function (e) {
        this.setData({
            showActionSheet: false,
        });
        wx.navigateBack({
            delta: -1
        })
    }
});
