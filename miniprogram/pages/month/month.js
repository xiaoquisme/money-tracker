// miniprogram/pages/month/month.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        month: null,
        monthDescription: '月账单',
        showActionSheet: true,
        groups: [
            'choice-month',
        ],
        onlyMe: false,
        allItems:[]
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
            onlyMe: e.detail.data.onlyMe,
        });
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
            this.setData({
                month: selectedDate,
                allItems:res.data
            });
        }).then(() => {
            wx.hideLoading();
        });
    }
});
