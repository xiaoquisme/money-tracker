// miniprogram/pages/today/lost.js
Page({

    data: {
        today: null,
        lostItems: [],
        incomeItems: [],
        todayLost: 0,
        todayIncome: 0,
    },

    onLoad: function (options) {
        const db = wx.cloud.database();
        const today = new Date().toISOString().split('T')[ 0 ];
        this.setData({
            today: today,
        });
        db.collection("money-tracker")
            .where({
                date: today
            })
            .get()
            .then(res => {
                const lostItems = res.data.filter(d => d.moneyType == "LOST").reverse();
                const incomeItems = res.data.filter(d => d.moneyType == "INCOME").reverse();
                const todayLost = lostItems.reduce((pre, cur) => parseFloat(cur.count)+ pre, 0);
                const todayIncome = incomeItems.reduce((pre, cur) => parseFloat(cur.count)+ pre, 0);
                this.setData({
                    lostItems: lostItems,
                    incomeItems: incomeItems,
                    today:today,
                    todayLost: todayLost,
                    todayIncome: todayIncome,
                });
            })
    },
});
