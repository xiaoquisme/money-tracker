Page({

    data: {
        week: null,
        weekDescription: "本周账单",
        lostItems: [],
        lostItemsTitle: "本周消费",
        incomeItems: [],
        incomeItemsTitle: "本周收入",
        weekLost: 0,
        weekIncome: 0,
        totalDescription: "累计消费",
    },

    onLoad: function (options) {
        wx.showLoading({ title: '数据加载中' });
        const date = new Date().toISOString().split('T')[ 0 ];
        wx.cloud.callFunction({
            name: "db",
            data: {
                type: "week",
                date: date,
            }
        }).then(res => res.result)
            .then(res => {
                const weekNumber = res.data[ 0 ].weekNumber;
                const lostItems = res.data.filter(d => d.moneyType === "LOST").reverse();
                const incomeItems = res.data.filter(d => d.moneyType === "INCOME").reverse();
                const weekLost = lostItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
                const weekIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count) + pre, 0);
                this.setData({
                    lostItems: lostItems,
                    incomeItems: incomeItems,
                    weekLost: weekLost,
                    week: weekNumber,
                    weekIncome: weekIncome,
                });
                wx.hideLoading();
            });
    },
});
