Page({

    data: {
        day: null,
        todayDescription: '日账单',
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
            onlyMe: e.detail.data.onlyMe,
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
            this.setData({
                day: selectedDate,
                allItems: res.data,
            });
        }).then(() => {
            wx.hideLoading();
        });
    }
});
