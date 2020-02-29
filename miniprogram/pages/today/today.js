// miniprogram/pages/today/lost.js
Page({

    data: {
        today: null,
        todayDescription: "今日账单",
        lostItems: [],
        lostItemsTitle: "今日消费",
        incomeItems: [],
        incomeItemsTitle: "今日收入",
        todayLost: 0,
        todayIncome: 0,
        totalDescription: "累计消费",
    },

    onLoad: function (options) {
        const today = new Date().toISOString().split('T')[ 0 ];
        this.setData({
            today: today,
        });
        wx.cloud.callFunction({
            name: 'db',
            data: {
                type: 'today',
                date: today,
            }
        }).then(res => res.result)
            .then(res => {
                const lostItems = res.data.filter(d => d.moneyType == "LOST").reverse();
                const incomeItems = res.data.filter(d => d.moneyType == "INCOME").reverse();
                const todayLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
                const todayIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
                this.setData({
                    lostItems: lostItems,
                    incomeItems: incomeItems,
                    today: today,
                    todayLost: todayLost,
                    todayIncome: todayIncome,
                });
            })
    },
});
