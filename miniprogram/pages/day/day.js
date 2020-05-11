Page({

    data: {
        day: null,
        todayDescription: '日账单',
        todayLost: 0,
        todayIncome: 0,
        totalDescription: '累计消费',
        showActionSheet: true,
        groups: [
            'choice-day',
        ],
        onlyMe: false,
        allItems:[]
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
    onOnlyMeChange: function (e) {
        this.setData({
            onlyMe: e.detail.value,
        });
    },
    loadData: function (selectedDate) {
        wx.showLoading({ title: '数据加载中' });
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'day',
                date: selectedDate,
                onlyMe: this.data.onlyMe,
            }
        }).then(res => res.result).then(res => {
            const lostItems = res.data.filter(d => d.moneyType === 'LOST').reverse();
            const incomeItems = res.data.filter(d => d.moneyType === 'INCOME').reverse();
            const todayLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            const todayIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
            this.setData({
                day: selectedDate,
                todayLost: todayLost,
                todayIncome: todayIncome,
                allItems: res.data,
            });
        }).then(() => {
            wx.hideLoading();
        });
    }
});
